---
title: 👮 DRF Authentication_01 - dj-rest-auth & TokenAuthentication
date: 2023-03-18 00:03:76
category: django
thumbnail: { thumbnailSrc }
draft: false
---

# 1. dj-rest-auth의 기본 인증
- 기본적으로 dj-rest-auth는 Django의 토큰 기반 인증을 사용하고 있다.
- dj-rest-auth 설치 후 `Installed_Apps`에 추가하는 앱 중 `rest_framework.authtoken`를 통해 확인할 수 있다.
- dj-rest-auth의 기본 인증으로 `JWT`를 사용하고 싶다면, `djangorestframework-simplejwt` 패키지 설치해야 한다. [(👮 _다음 포스팅_ )](https://soojiinleee.github.io/Django/DRF-Authentication-01---dj-rest-auth-&-JWT)

### 참고
- [DRF- dj-rest-auth](https://www.django-rest-framework.org/api-guide/authentication/#django-rest-auth-dj-rest-auth)
- [dj-rest-auth 공식문서](https://dj-rest-auth.readthedocs.io/en/latest/index.html)


# TokenAuthentication
## TOKEN_MODEL
- `dj-rest-auth`의 기본 설정을 보면 `rest_framework.authtoken` 의 Token 모델을 사용하는 것을 알 수 있다.
    ```python
  'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
    ```
- `rest_framework.authtoken` 앱을 추가하고 `migrate`를 하면 `DB`에 `authtoken_token` 테이블이 생성된다.
  ![스크린샷 2023-03-18 오전 1.37.59.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Flp%2Fzmn7f4sn231574d2zhwt8bk80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_qI2Dsg%2F%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-03-18%20%EC%98%A4%EC%A0%84%201.37.59.png)


- 로그인 성공 시 토큰이 발행되고, 
![스크린샷 2023-03-18 오전 1.41.38.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Flp%2Fzmn7f4sn231574d2zhwt8bk80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_L1HeOF%2F%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-03-18%20%EC%98%A4%EC%A0%84%201.41.38.png)

- `authtoken_token`에 유저 id와 발행된 토큰이 key로 저장된다.
![스크린샷 2023-03-18 오전 1.42.11.png](..%2F..%2F..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2Flp%2Fzmn7f4sn231574d2zhwt8bk80000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_LzXV7o%2F%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202023-03-18%20%EC%98%A4%EC%A0%84%201.42.11.png)

## dj-rest-auth : LoginView
- 인증 유형(`JWT`/`TOKEN`/`SESSION`)에 따라 다르게 처리 되어 있다.
- `dj-rest-auth`의 기본 설정에 인증 유형에 따른 `serializer` 처리도 되어 있고 커스텀도 가능하다.
    ```python
  'TOKEN_SERIALIZER': 'dj_rest_auth.serializers.TokenSerializer',
  'JWT_SERIALIZER': 'dj_rest_auth.serializers.JWTSerializer',
    ```
- 구체적으로 어떻게 동작하는 지 코드를 확인하는 것이 제일 빨리 이해되는 거 같다.

### 참고
- [dj-rest-auth : Configuration](https://dj-rest-auth.readthedocs.io/en/latest/configuration.html#configuration)
- [DRF-TokenAuthentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
- [dj-rest-auth github: LoginView](https://github.com/iMerica/dj-rest-auth/blob/master/dj_rest_auth/views.py)


<br>
<br>

> `dj-rest-auth`에서 기본 인증으로 `Token`을 사용한다면, DRF의 `TokenAuthentication` 내용을 확인하고 커스텀해서 사용해도 될 거 같다.
> `JWT`를 적용하려다가 `{"key" : " "}` 가 어디서 주는 응답인지 찾다가 정리하는 포스팅..🦜
