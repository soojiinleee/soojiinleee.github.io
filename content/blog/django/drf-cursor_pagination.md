---
title: 📌 DRF - CursorPagination
date: 2025-03-06 18:39:76
description: CursorPagination에서 정렬하기
---

공연 리뷰를 무한 스크롤로 조회하고 싶어서 `CursorPagination`로 구현 했으나,\
공연순 정렬이 적용 되지 않아 생긴 문제를 정리한 포스팅 🙃

# 목차
- [문제 상황](#문제-상황)
- [원인 분석](#원인-분석)
- [해결 방법](#해결-방법)
- [OrderingFilter](#orderingfilter)


# 문제 상황
- 예상된 정렬: 공연 이름(`performance__name`)
- 실제 정렬: 최신 작성일(`-created_at`)

# 원인 분석

### 1️⃣ 쿼리 파라미터 전달 여부 확인
`sort_by=name`을 잘 전달 되고,\
`query_set`에도 `order_by('performance__name')`이 적용되고 있으나\
최종 응답 값은 `-created_at` 으로 반환됨.. 😇

#### `views.py`
```python
class ReviewViewSet(viewsets.ModelViewSet):
    """공연 후기 CRUD API"""
    pagination_class = StandardCursorPagination

    def get_queryset(self):
        queryset = Review.objects.select_related('user', 'performance').select_related('performance__genre').all()

        is_my_review = self.request.query_params.get('is_my_review', False)
        sort_by = self.request.query_params.get('sort_by', None)  # 마이페이지: 리뷰 정렬
        
        if is_my_review:    # 내가 작성한 리뷰만 조회
            queryset = queryset.filter(user__id=self.request.user.id)
            if sort_by == "name":
                queryset = queryset.order_by('performance__name')
            else:
                queryset = queryset.order_by('-created_at')

        return queryset
```

### 2️⃣ `CursorPagination`의 기본 정렬 확인
`StandardCursorPagination` 클래스에서 기본 정렬이 `-created_at`으로 되어 있어서,
`get_queryset`에서 변경한 정렬 기준(`performance__name`)이 적용 안 됨

#### `paginations.py`
```python
class StandardCursorPagination(BasePaginationResponseMixin, CursorPagination):
    page_size = 10
    ordering = '-created_at'  # 기본 정렬이 최신 생성일 기준
```

### 🔷 `pagination` 적용 시점
1. `get_queryset()`에서 데이터베이스 쿼리(`queryset`) 결정
2. `pagination`이 `queryset`에 적용
   - `CursorPagination`는 이 단계에 `ordering`과 `limit` 적용
3. `serializer` 호출



# 해결 방법

### `OrderingFilter`활용

> [**공식 문서**](https://www.django-rest-framework.org/api-guide/pagination/#cursorpagination): `ordering` 속성을 `CursorPagination` 클래스에서 직접 오버라이드하거나, `OrderingFilter`와 함께 사용하면 동적 정렬이 가능합니다.

### 1️⃣ `CursorPagination` 기본 정렬 제거
기본 `ordering` 값을 `None`으로 설정하여,\
`OrderingFilter`에서 정렬 기준을 동적으로 반영하게 변경

#### `paginations.py`
```python
class StandardCursorPagination(BasePaginationResponseMixin, CursorPagination):
    page_size = 10
    ordering = None  # 기본 정렬 해제
```

### 2️⃣ `OrderingFilter` 적용

- `OrderingFilter`를 `filter_backends` 추가하여 클라이언트에서 `ordering` 파라미터를 사용해 정렬
- 허용할 정렬 필드를 `ordering_fields`에 명시
- 기본 정렬을 `ordering = ['-created_at']`으로 설정하여 쿼리 파라미터가 없을 경우 최신순 정렬이 적용

#### `views.py`
```python
class ReviewViewSet(viewsets.ModelViewSet):
    """공연 후기 CRUD API"""
    pagination_class = StandardCursorPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['performance__name']
    ordering = ['-created_at']  # 기본 정렬: 최신 리뷰

    def get_queryset(self):
        queryset = Review.objects.select_related('user', 'performance').select_related('performance__genre').all()
        is_my_review = self.request.query_params.get('is_my_review', False)
        
        if is_my_review:    # 내가 작성한 리뷰만 조회
            queryset = queryset.filter(user__id=self.request.user.id)

        return queryset
```

### 3️⃣ 정렬 쿼리 파라미터 사용
```shell
GET /reviews/?ordering=performance__name  # 공연 이름 순 정렬
GET /reviews/?ordering=-created_at       # 최신순 정렬
```


# OrderingFilter

`OrderingFilter`는 Django REST Framework에서 제공하는 필터링 기능 중 하나로, 사용자가 쿼리 파라미터를 통해 원하는 정렬 기준 적용

### 📌 주요 기능
- `ordering_fields` 속성을 사용하여 정렬 가능한 필드를 제한할 수 있음
- `ordering` 속성을 설정하면 기본 정렬을 지정할 수 있음
- 클라이언트에서 `?ordering=필드명`을 쿼리 파라미터로 전달하여 동적 정렬 가능

### 📌 예제 코드
```python
from rest_framework.filters import OrderingFilter

class MyViewSet(viewsets.ModelViewSet):
    filter_backends = [OrderingFilter]
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']
```

이렇게 설정하면 클라이언트는 `?ordering=name` 또는 `?ordering=-created_at`과 같은 요청 가능





