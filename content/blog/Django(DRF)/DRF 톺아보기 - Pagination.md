# Contents
- [🔷 개념](#-🔷-개념)
- [🔷 1. PageNumberPagination](#-🔷-1.-PageNumberPagination)
  - [🚀 페이지네이션 정보 `Response Header`에 추가하기](##-🚀-페이지네이션-정보-Response-Header에-추가하기)
- [🔷 2. LimitOffsetPagination](#-🔷-2.-LimitOffsetPagination)
- [🔷 3. CursorPagination](#-🔷-3.-CursorPagination)
- [🔹 DRF Pagination 방식 비교표](#-🔹-DRF-Pagination-방식-비교표)
- [🔹 어떤 Pagination을 선택해야 할까?](#-🔹-어떤-Pagination을-선택해야-할까?)


<br>
<br>

# 🔷 개념

---

- 대량의 데이터를 여러 페이지로 나누어 조회하는 기법
- REST API에서 페이지네이션을 적용하면 클라이언트가 한 번에 모든 데이터를 불러오는 것이 아니라, 필요한 만큼만 가져올 수 있음
    
    → 데이터베이스의 부담을 줄이고 API 응답 속도를 개선
    
- view가 `generic views` or `viewsets`  구현되어 있다면, settings.py에 설정하면 자동으로 실행됨
- `APIView` 으로 구현한 경우 직접 페이지네이션한 응답을 전달해야 함

# 🔷 1. PageNumberPagination

---

✅ **개념**

- 페이지 번호(`page`)를 기반으로 데이터를 나누는 방식
- 사용자가 특정 페이지 번호를 요청하면 해당 페이지의 데이터만 반환됨.
- 일반적인 웹사이트의 "다음 페이지”, "이전 페이지" 방식과 동일함.

✅ **장점**

- `?page=2`와 같은 직관적인 URL로 페이지 요청이 가능함.
- `count`(전체 데이터 개수) 포함 → 총 페이지 수를 쉽게 계산할 수 있음.

✅ **단점**

- 데이터가 많아지고 특정 페이지로 이동하려면 부담이 커짐.
- `count`를 계산하는 쿼리가 실행되므로 대량의 데이터에서 성능 저하 가능.

```python
# pagination.py
===========================================================================
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    
# views.py
===========================================================================
from rest_framework import viewsets, mixins
from core.paginations import StandardResultsSetPagination
from .models import Performance
from .serializers import PerformanceSerializer

class PerformanceViewSet(mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):
    """공연 리스트 및 상세 조회 API"""
    serializer_class = PerformanceSerializer
    pagination_class = StandardResultsSetPagination
```

- `page_size` : 한 번에 가져올 데이터 개수
- `page_query_param`
    - `page` 라는 query parm 사용 할 수 있음
    - (e.g.)`/performance?status=공연 중&page=1`
- `page_size_query_param`
    - 원하는 사이즈로 조정할 수 있는 query parm
    - (e.g.)`/performance?status=공연 중&page_size=10`
- `max_page_size`
    - 최대 지정할 수 있는 `page_size`
    - `max_page_size` 보다 큰 값이 query_param으로 들어온 경우 설정된 값으로 실행
    - (e.g.)`/performance?status=공연 중&page_size=200`  → `page_size`=100으로 실행
- `last_page_strings`
    - 마지막 페이지로 이동 하고 싶을 때 page 번호가 아닌 `last` 라는 문자열로 검색 할 수 있음
    - (e.g.)`/performance?status=공연 중&page=last`

> https://www.django-rest-framework.org/api-guide/pagination/#configuration


### 📌 기본 응답 형태

```json
{
    "count": 3,
    "next": "http://127.0.0.1:8000/performance/?page=2&page_size=2&status=%EA%B3%B5%EC%97%B0+%EC%A4%91",
    "previous": null,
    "results": [
        {
            "id": 7,
            "genre": "뮤지컬",
            "name": "웃는 남자",
            "status": "공연 중",
            "price": 170000,
            "started_at": "2025-01-09",
            "ended_at": "2025-03-09"
        },
        {
            "id": 2,
            "genre": "뮤지컬",
            "name": "지킬앤하이드",
            "status": "공연 중",
            "price": 170000,
            "started_at": "2021-11-29",
            "ended_at": "2025-05-18"
        },
        ...
    ]
}
```

## 🚀 페이지네이션 정보 `Response Header`에 추가하기

`Response Body`가 아닌 `Response Header`에 추가 했을 때 장점 (w. ***GPT***)

✅ **API 응답 크기 감소 (효율성)**

- `next`, `previous` 같은 정보를 `Response Body`에 포함하면 JSON 크기가 증가
- 헤더에 추가하면 응답 데이터(`results` 배열) 크기를 줄일 수 있어 API 성능이 향상

✅ **RESTful API 원칙에 맞음**

- API 응답 본문(`body`)은 리소스 데이터(`results`)만 포함하는 것이 좋
- 페이지네이션 메타데이터(`next`, `previous`)는 응답 헤더(`header`)로 분리하는 것이 더 RESTful한 설계 방식

✅ **클라이언트가 쉽게 처리 가능**

- 프론트엔드(React, Vue, Angular)나 모바일 앱에서는 **헤더에서 직접 페이지네이션 정보를 추출**

```python
# pagination.py
===========================================================================
from rest_framework.pagination import PageNumberPagination, CursorPagination
from rest_framework.response import Response

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        response = Response(data)

        # 페이지네이션 링크를 헤더에 추가
        if self.get_next_link():
            response.headers['Next-Page'] = self.get_next_link()
        if self.get_previous_link():
            response.headers['Previous-Page'] = self.get_previous_link()
        response.headers['Total-Count'] = self.page.paginator.count

        return response
```

→ [link-header-pagination](https://www.django-rest-framework.org/api-guide/pagination/#link-header-pagination) 패키지로도 구현 가능

### 📌 변경된 응답 형태

> *page_size =1, page=1로 테스트*
> 

- Response Header
    
    ```json
    HTTP 200 OK
    Allow: GET, HEAD, OPTIONS
    Content-Type: application/json
    Next-Page: http://127.0.0.1:8000/performance/?page=3&page_size=1&status=%EA%B3%B5%EC%97%B0+%EC%A4%91
    Previous-Page: http://127.0.0.1:8000/performance/?page_size=1&status=%EA%B3%B5%EC%97%B0+%EC%A4%91
    Total-Count: 3
    Vary: Accept
    ```
    
- Response Body
    
    ```json
    [
        {
            "id": 2,
            "genre": {
                "id": 9,
                "name": "뮤지컬"
            },
            "name": "지킬앤하이드",
            "status": "공연 중",
            "price": 170000,
            "started_at": "2021-11-29",
            "ended_at": "2025-05-18"
        }
    ]
    ```
    

# 🔷 2. LimitOffsetPagination

---

✅ **개념**

- 클라이언트가 `limit`(한 번에 가져올 데이터 개수)와 `offset`(데이터 시작 위치)을 직접 지정하는 방식
- SQL의 `LIMIT`과 `OFFSET` 개념과 유사함.

✅ **장점**

- 특정 범위의 데이터를 유연하게 요청할 수 있음 (`limit=20&offset=100` → 101~120번째 데이터 반환).
- 사용자가 원하는 `limit`을 조정하여 적절한 데이터 크기를 선택할 수 있음.

✅ **단점**

- `count`를 계산하는 쿼리가 실행되므로 대량의 데이터에서는 성능 저하 가능.
- `offset` 값이 클 경우, 데이터 조회가 느려질 수 있음.

```python
# settings.py
===========================================================================

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10,  # 기본 limit 값
}
```

### 📌 기본 응답 형태

```json
{
    "count": 3,
    "next": "http://127.0.0.1:8000/performance/?limit=2&offset=2&status=%EA%B3%B5%EC%97%B0+%EC%A4%91",
    "previous": null,
    "results": [
        {
            "id": 7,
            "genre": {
                "id": 9,
                "name": "뮤지컬"
            },
            "name": "웃는 남자",
            "status": "공연 중",
            "price": 170000,
            "started_at": "2025-01-09",
            "ended_at": "2025-03-09"
        },
				...
    ]
}
```

🚀 `count`, `next`, `previous` 정보가 있기 때문에 [PageNumberPagination](https://www.notion.so/DRF-Pagination-19fc8dab33a280b489cef2ba8ea20c99?pvs=21)과 마찬가지로 `Response Header`에 해당 정보 추가할 수 있음 

> https://www.django-rest-framework.org/api-guide/pagination/#limitoffsetpagination
> 

# 🔷 3. CursorPagination

---

✅ **개념**

- 데이터베이스의 특정 필드(일반적으로 `created_at` 또는 `id`)를 기반으로 다음 데이터를 요청하는 방식
- 페이스북, 트위터 등의 무한 스크롤 API에서 사용됨.
- 데이터 정렬 필수 → `ordering = '-created'` 기본으로 설정되어 있음

✅ **장점**

- `count` 쿼리가 필요 없으므로, 대량의 데이터를 빠르게 조회할 수 있음.
- `offset` 기반 페이지네이션보다 성능이 뛰어남.

✅ **단점**

- `next`와 `previous`가 암호화된 `cursor` 값으로 반환되어, 사용자가 특정 페이지로 직접 이동할 수 없음.
- 데이터 정렬(`ORDERING`)이 필수.

### 📌 기본 응답 형태

```json
{
    "next": "http://127.0.0.1:8000/review/?cursor=cD0yMDI1LTAyLTE4KzA2JTNBNDclM0ExNi4zNTc4MjMlMkIwMCUzQTAw",
    "previous": null,
    "results": [
        {
            "id": 8,
            "user": 3,
            "performance": 7,
            "content": "진~짜 재밌어요!",
            "created_at": "2025-02-18T06:47:16.357823Z",
            "updated_at": "2025-02-18T06:47:16.357840Z"
        },
        ...
    ]
}
```

- `cursor` 값은 `base64`로 인코딩된 문자열으로 보안을 위해 `Header`에 추가하는 것이 적절함
- `cursor` 값은 `id` 또는 `created_at` 등의 기준을 포함하고 있어, 직접 수정하면 원치 않는 데이터 조회가 발생할 수 있음
- `cursor` 는 암호화 되어 전달 되므로 `Response Header`에 추가하는 게 더 좋음
    
    →  [PageNumberPagination](https://www.notion.so/DRF-Pagination-19fc8dab33a280b489cef2ba8ea20c99?pvs=21)에서 `Response Header` 추가한 내용 참고✨
    
- `count`(전체 데이터 개수) 쿼리가 없음

> https://www.django-rest-framework.org/api-guide/pagination/#cursorpagination


# 🔹 DRF Pagination 방식 비교표

---

| ✅ 방식 | ✅ URL 예제 | ✅ 특징 | ✅ 장점 | ✅ 단점 |
| --- | --- | --- | --- | --- |
| `PageNumberPagination` | `?page=2` | **페이지 번호 기반** | 직관적인 페이지 이동 | 대량 데이터에서 성능 저하 가능 |
| `LimitOffsetPagination` | `?limit=10&offset=20` | **SQL `LIMIT OFFSET` 방식** | 유연한 범위 선택 가능 | `offset`이 클 경우 속도 저하 |
| `CursorPagination` | `?cursor=abc123` | **커서 기반 무한 스크롤** | 성능 우수, `count` 쿼리 없음 | 특정 페이지 직접 이동 불가능 |

---

# 🔹 어떤 Pagination을 선택해야 할까?

✅ **`PageNumberPagination` →** 일반적인 웹사이트의 페이지네이션처럼 페이지 번호로 데이터를 조회하고 싶을 때.

✅ **`LimitOffsetPagination` →** 클라이언트가 원하는 데이터 개수(`limit`)와 시작 위치(`offset`)을 지정하고 싶을 때.

✅ **`CursorPagination` →** 무한 스크롤이 필요하고, 성능을 최적화하고 싶을 때 (페이스북, 트위터 등).

😊 **즉, 일반적인 REST API에는 `PageNumberPagination`이 적절하지만, 무한 스크롤을 원한다면 `CursorPagination`을 사용하는 것이 더 좋음!**