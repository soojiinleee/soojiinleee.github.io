---
title: 📚 TDD Chapter 05
date: 2022-11-14 22:11:23
description: 사내 스터디 - 파이썬을 이용한 클린 코드를 위한 테스트 주도 개발 챕터 5 (사용자 입력 저장하기)
---

> [파이썬을 이용한 클린 코드를 위한 테스트 주도 개발](https://product.kyobobook.co.kr/detail/S000001556139)

# Contents
- [Contents](#contents)
- [POST 요청 테스트](#post-요청-테스트)
  - [1. Request](#1-request)
    - [참고](#참고)
  - [2. Templates - Form](#2-templates---form)
    - [🔒 CSRF](#-csrf)
    - [참고](#참고-1)
  - [3. 서버에서 POST 요청 처리](#3-서버에서-post-요청-처리)
  - [5. POST/Redirect/GET](#5-postredirectget)

<br>

-----

# POST 요청 테스트
책 예제 코드 실습하면서 책과 다른 에러 내용 위주로 기록

책의 장고 버전이 1.7이라서 실습 장고 환경이랑 달라서 에러 내용도 다르다.


## 1. Request
- POST 요청 연결

셀레니움으로 기능테스트(functional_test.py) 하면 아래 에러가 발생한다.

```shell
❯ python functional_test.py 
E
======================================================================
ERROR: test_can_start_a_list_and_retrieve_it_later (__main__.NewVisitorTest)
----------------------------------------------------------------------
Traceback (most recent call last):
[...]
selenium.common.exceptions.StaleElementReferenceException: Message: The element reference of <table id="id_list_table"> is stale; either the element is no longer attached to the DOM, it is not in the current frame context, or the document has been refreshed
```
테이블이 생성되기 전에 모든 코드가 다 실행되서 생기는 에러였다.
functional_test.py 에서 time.sleep 옵션으로 테이블 생성 되길 기다렸다가 하면 에러 해결된다.

```python
# line 38

# 엔터키를 치면 페이지가 갱신되고 작업 목록에
# "1: 공작깃털사기" 아이템이 추가된다
inputbox.send_keys(Keys.ENTER)

import time
time.sleep(5)

table = self.browser.find_element_by_id('id_list_table')
rows = table.find_elements_by_tag_name('tr')
```
### 참고
- 책 61쪽
- [크롤링 관련 selenium-stale-에러](https://study-grow.tistory.com/entry/%ED%81%AC%EB%A1%A4%EB%A7%81-%EA%B4%80%EB%A0%A8-selenium-stale-%EC%97%90%EB%9F%AC)

---

## 2. Templates - Form
- 입력 데이터 제출

### 🔒 CSRF
- Django는 각 Form이 생성하는 POST 요청을 확인할 수 있는 토큰을 자동 생성하여 CSRF으로부터 보호함
- `{% csrf_token %}` 템플릿 태그를 추가하여 템플릿의 `<input>` 통해 POST 요청 보낼 수 있음
- Django는 CSRF 토큰을 포함하는 `<input type="hidden">` 요소로 변경해서 렌더링 함


functional_test.py를 실행하면 CSRF 토큰이 `<input type=hidden>` 으로 렌더링하여 아래와 같이 에러가 발생한다.
```shell
❯ python manage.py test lists
Found 3 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
FF.
======================================================================
FAIL: test_home_page_can_save_a_POST_request (lists.tests.HomePageTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/s2jiin/Develop/Book-Practices/Book-TDD-Web-Dev-Python/superlists/lists/tests.py", line 37, in test_home_page_can_save_a_POST_request
    self.assertEqual(response.content.decode(), expected_html)
AssertionError: '<htm[235 chars]     <input type="hidden" name="csrfmiddleware[230 chars]l>\n' != '<htm[235 chars]     -->\n        </form>\n        \n        <[100 chars]l>\n'

======================================================================
```
CSRF `<input>` 태그를 없애는 함수를 추가해서 해결했다.

### 참고
- [python-django-tdd-03](https://seon54.github.io/python/2019/12/31/python-django-tdd-03/)

-----

## 3. 서버에서 POST 요청 처리
- DB 저장
- 입력된 내용 템플릿 변수에 전달하여 HTML 출력

----
## 5. POST/Redirect/GET
- POST 요청을 저장한 응답을 렌더링 하는 것이 아니라
- 홈페이지로 다시 리디렉션 하기
