---
title: 📌 DRF - annotate & serializer field
date: 2025-02-19 16:03:76
description: ORM의 annotate를 serializer field로 사용하기
---
# Contents
- [🔷 요구 사항](#-🔷-요구-사항)
- [🔷 문제 상황](#-🔷-문제 상황)
- [🔷 해결](#-🔷-해결)
  - [1. ViewSet의 get_queryset 수정하기](##-1.-ViewSet의-get_queryset-수정하기)
  - [2. models.Manager 활용하기](##-2.-models.Manager-활용하기)

<br>
<br>

# 🔷 요구 사항

- 공연 상태 기준으로 공연 목록 필터링
    - (e.g.) `/performance?status=예정`

# 🔷 문제 상황

```python
# models.py
============================================================================

from django.db import models

class Performance(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='performances', verbose_name='장르')
    code = models.CharField(max_length=100, unique=True, verbose_name='KOPIS 공연ID')
    name = models.CharField(max_length=255, verbose_name='공연명')
    price = models.IntegerField(verbose_name='티켓 가격', null=False, default=0)
    started_at = models.DateField(verbose_name='공연 시작일')
    ended_at = models.DateField(verbose_name='공연 종료일')

    def get_status(self):
        "공연 상태 반환"
        today = datetime.today().date()
        if self.started_at <= today <= self.ended_at:
            return "공연 중"
        elif today > self.ended_at:
            return "종료"
        else:
            return "예정"
```

- 공연 상태는 `get_status`라는 인스턴스 메소드로 판별 되고 있음
- ORM 쿼리셋에서 직접 필터링 할 수 없음
    
    → ✨ `annotate()`를 활용해서 쿼리셋에 필드 추가 해야 함
    

# 🔷 해결

## 1. `ViewSet`의 `get_queryset` 수정하기

```python
# serializers.py
============================================================================
class PerformanceSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)
    status = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = Performance
        fields = ['id', 'genre', 'name', 'status', 'price', 'started_at', 'ended_at']

# views.py
============================================================================

from django.db.models import Case, When, Value, CharField
from rest_framework import viewsets, mixins
from .models import Performance
from .serializers import PerformanceSerializer

class PerformanceViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    """공연 리스트 및 상세 조회 API"""
    serializer_class = PerformanceSerializer

    def get_queryset(self):
        """✅ `status`를 필드처럼 사용 가능하도록 `annotate()` 활용"""
        today = datetime.today().date()

        queryset = Performance.objects.select_related('genre').annotate(
            status=Case(
                When(started_at__lte=today, ended_at__gte=today, then=Value("공연 중")),
                When(ended_at__lt=today, then=Value("종료")),
                default=Value("예정"),
                output_field=CharField()
            )
        )

        status = self.request.query_params.get('status', None)
        
        if status:
            queryset = queryset.filter(status=status)

        return queryset
```

- 공연 상태(`status`) 기준으로 필터링 가능 🙃
- 공연 목록 데이터가 serializer 될 때 `status` 필드의 값은 인스턴스 메소드로 정의된 `get_status` 를 통해 확인하게 됨
    
    → `models.py`와 `views.py`에 `status` 계산 하는 중복 로직이 존재하게 됨
    

## 2. `models.Manager` 활용하기

```python
# models.py
============================================================================

class PerformanceManager(models.Manager):
    def get_queryset(self):
        today = datetime.today().date()
        return super().get_queryset().annotate(
            status=Case(
                When(started_at__lte=today, ended_at__gte=today, then=Value("공연 중")),
                When(ended_at__lt=today, then=Value("종료")),
                default=Value("예정"),
                output_field=CharField()
            )
        )

class Performance(models.Model):
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='performances', verbose_name='장르')
    code = models.CharField(max_length=100, unique=True, verbose_name='KOPIS 공연ID')
    name = models.CharField(max_length=255, verbose_name='공연명')
    price = models.IntegerField(verbose_name='티켓 가격', null=False, default=0)
    started_at = models.DateField(verbose_name='공연 시작일')
    ended_at = models.DateField(verbose_name='공연 종료일')

    objects = PerformanceManager()
```

- `models.Manager` 의 `get_queryset()` 을 수정하여 공연 데이터를 조회 할 때 status 필드가 추가 될 수 있도록 함
- `ViewSet`에서 사용하는 `queryset`은 `model.Manager`가 반환하는 쿼리셋을 기반하기 때문에 `annotate()` 로직을 model에 작성

### ✅ serializers 수정

- `Performance` 모델의 `queryset`에서 `status`를 `annotate()`로 추가했기 때문에, `Serializer`에서 `source='status'`를 지정할 필요가 없음

```python
from rest_framework import serializers
from performance.models import Performance
from genre.serializers import GenreSerializer

class PerformanceSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)
    status = serializers.CharField(read_only=True)  # ✅ source 제거

    class Meta:
        model = Performance
        fields = ['id', 'genre', 'name', 'status', 'price', 'started_at', 'ended_at']

```

### ✅ 최종 view

```python
from rest_framework import viewsets, mixins
from .models import Performance
from .serializers import PerformanceSerializer

class PerformanceViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    """공연 리스트 및 상세 조회 API"""
    serializer_class = PerformanceSerializer

    def get_queryset(self):
        queryset = Performance.objects.select_related('genre').all()
        status = self.request.query_params.get('status', None)

        if status:
            queryset = queryset.filter(status=status)
        return queryset
```

> [django-annotate](https://docs.djangoproject.com/en/5.1/ref/models/querysets/#annotate)
> [stackoverflow](https://stackoverflow.com/questions/56909019/annotations-in-django-with-model-managers)