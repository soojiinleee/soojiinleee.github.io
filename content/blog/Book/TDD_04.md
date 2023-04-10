---
title: '📚 TDD Chapter 04 : `templates`을 이용한 FT 테스트'
date: 2022-05-03
category: Book
thumbnail: { thumbnailSrc }
draft: false
---
# 사용자 반응 테스트 (with `Selenium`)
기능 테스트 파일

```python
# functional_tests.py

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import unittest

class NewVisitorTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.browser.implicitly_wait(3)

    def tearDown(self):
        self.browser.quit()
    
    def test_can_start_a_list_and_retrieve_it_later(self):
        # 에디스(Edith)는 멋진 작업 목록 온라인 앱이 나왔다는 소식을 듣고
        # 해당 웹 사이트를 확인하러 간다
        self.browser.get('http://localhost:8000')
        
        # 웹 페이지 타이틀과 헤더가 'To-Do'를 표시하고 있다
        self.assertIn('To-Do', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('To-Do', header_text)

        # 그녀는 바로 작업을 추가하기로 한다
        inputbox = self.browser.find_element_by_id('id_new_item')
        self.assertEqual(
            inputbox.get_attribute('placehoder'),
            '작업 아이템 입력'
        )
        # "공작깃털 사기"라고 텍스트 상자에 입력한다
        # (에디스의 취미는 날치 잡이용 그물을 만드는 것이다)
        inputbox.send_keys('공작깃털 사기')


        # 엔터키를 치면 페이지가 갱신되고 작업 목록에
        # "1: 공작깃털사기" 아이템이 추가된다
        inputbox.send_keys(Keys.ENTER)

        table = self.browser.find_element_by_id('id_list_table')
        rows = table.find_elements_by_tag_name('tr')
        self.assertTrue(
            any(row.text == '1: 공작깃털 사기' for row in rows),
        )

        # 추가 아이템을 입력할 수 있는 여분의 텍스트 상자가 존재한다
        # 다시 "공작깃털을 이용해서 그물 만들기"라고 입력한다(에디스는 매우 체계적인 사람이다)
        self.fail('Finish the test!')

        # 페이지는 다시 갱신되고, 두 개 아이템이 목록에 보인다
        # 에디스는 사이트가 입력한 목록을 저장하고 있는지 궁금하다
        # 사이트는 그녀를 위한 특정 URL을 생성해준다
        # 이 때 URL에 대한 설명도 함께 제공된다

        # 해당 URL에 접속하면 그녀가 만든 작업 목록이 그대로 있는 것을 확인할 수 있다

        # 만족하고 잠자리에 든다


if __name__ == '__main__':
    unittest.main(warnings='ignore')
```
- `selenium` 제공 메소드 :
  - `find_element_by_tag_name`, `find_element_by_id`, : 하나의 요소만 반환, 요소가 없는 경우 예외 발생
  - `find_elements_by_tag_name` : 리스트 반환, 리스트 비어 있어도 OK
- `send_keys` : `selenium`의 입력 요소를 타이핑하는 방법
- `Keys` 클래스 : Entersk Ctrl 같은 특수 키 입력 전송

다시 기능 테스트(FT)를 실행하면 `<h1>` 요소를 페이지에서 찾지 못 했다는 에러가 발생한다.
```python
selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: h1
```

HTML을 문자열로 테스트하는 것은 상수 테스트와 같다고 할 수 있다. 단위 테스트는 로직이나 흐름 제어, 설정 등을 테스트하기 위한 것이다.

정확히 어떤 글자들이 HTML 문자열에 배열되 있는지 체크하는 것이 아무 의미가 없다.

이 경우 템플릿을 이용하는 것이 훨씬 나은 접근법이다. HTML을 `.html` 확장자의 파일 형태로 보관하여 효율적인 구문 검증을 할 수 있다.

## 리팩터링(Refactoring)
### 용어
- 리팩터링
  - "기능(결과물)은 바꾸지 않고" 코드 자체를 개선하는 작업이다.
  - "기능은 바꾸지 않고"라는 것이 핵심이다.
  - 리팩토링과 기능 변경은 전혀 다른 개념이다.

### 규칙
- 앱코드와 테스트 코드를 한 번에 수정하는 것이 아니라 하나씩 수정해야 한다.
- 작은 단계로 나누어 작업해야 한다.

`lists`앱에 `templates` 라는 폴더를 만들고 여기에 템플릿 파일들을 저장한다.
```html
# lists/templates/home/html

<html>
    <title>To-Do lists</title>
</html>
```
`views.py`에서 함수를 수정한다.
```python
# lists/views.py

from django.shortcuts import render

def home_page(request):
    return render(request, 'home.html')
```
- `render`함수
  - 첫 번째 인수로 `request` 을 지정하고, 두 번째 인수로 런데링할 템플릿명을 지정한다.
  - `Django`는 앱 폴더 내에 있는 `templates`이라는 폴더를 자동으로 검색한다.
  - 그리고 템플릿 콘텐츠를 기반으로 `HttpResponse`를 만들어준다.

이렇게 수정하고 `python manage.py test`를 실행시키면, `render` 부분에서 에러가 발생한다.
```python
======================================================================
ERROR: test_home_page_returns_correct_html (lists.tests.HomePageTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/s2jiin/Develop/TDD_with_Python/superlists/lists/tests.py", line 16, in test_home_page_returns_correct_html
    response = home_page(request)
  File "/Users/s2jiin/Develop/TDD_with_Python/superlists/lists/views.py", line 7, in home_page
    return render(request, 'home.html')
  File "/Users/s2jiin/.pyenv/versions/3.8.12/lib/python3.8/site-packages/django/shortcuts.py", line 24, in render
    content = loader.render_to_string(template_name, context, request, using=using)
  File "/Users/s2jiin/.pyenv/versions/3.8.12/lib/python3.8/site-packages/django/template/loader.py", line 61, in render_to_string
    template = get_template(template_name, using=using)
  File "/Users/s2jiin/.pyenv/versions/3.8.12/lib/python3.8/site-packages/django/template/loader.py", line 19, in get_template
    raise TemplateDoesNotExist(template_name, chain=chain)
django.template.exceptions.TemplateDoesNotExist: home.html

----------------------------------------------------------------------
Ran 2 tests in 0.005s

FAILED (errors=1)
Destroying test database for alias 'default'...

```

아직 앱을 `Django`에 등록하지 않아서 에러가 발생한다. `settings.py`에서 앱을 추가하고 다시 테스트를 실행 시키면 에러는 해결된다.

코드 리팩터링은 완료했다. 이제 상수를 테스트하는 것이 아닌 구현 결과물을 비교하도록 단위 테스트를 수정해야 한다.

```python
# lists/tests.py

from django.template.loader import render_to_string
[...]

    def test_home_page_returns_correct_html(self):
        request = HttpRequest()
        response = home_page(request)
        expected_html = render_to_string('home.html')
        self.assertEqual(response.content.decode(), expected_html)
```
- `render_to_string` 함수를 이용해 템플릿 렌더링을 테스트 할 수 있다.
- `.decode()`를 이용해서 `response.content` 바이트 데이터를 파이썬 유니코드 문자열로 변환한다. (문자열을 서로 비교)

### TDD 테스트 - 코드 주기
아직 기능 테스트 실패를 하고 있으므로 코드를 수정해야 한다. 이제 HTML이 템플릿 형태 이기 때문에 추가적인 단위 테스트 없이 바로 수정할 수 있다.
- 코드
    ```html
    <html>
        <head>
            <title>To-Do lists</title>
    
        </head>
        <body>
            <h1>Your To-Do list</h1>
        </body>
    </html>
    
    ```
- 테스트
    ```python
    selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: [id="id_new_item"]
    ```
- 코드 : `<input>` 추가
    ```html
    [...]
        <body>
            <h1>Your To-Do list</h1>
            <input id="id_new_item"/>
        </body>
    [...]
    ```
- 테스트
    ```python
    AssertionError: None != '작업 아이템 입력'
    ```
- 코드 : placeholder 텍스트 추가
    ```html
        [...]
        <body>
            <h1>Your To-Do list</h1>
            <input id="id_new_item" placeholder="작업 아이템 입력"/>
        </body>
        [...]
    ```
- 테스트 : 테이블이 없다는 에러
    ```python
    selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: [id="id_list_table"]
    ```
- 코드
    ```html
            <body>
                <h1>Your To-Do list</h1>
                <input id="id_new_item" placeholder="작업 아이템 입력" />
                <table id="id_list_table">
                </table>
            </body>
    ```
- 테스트
    ```python
    ======================================================================
    FAIL: test_can_start_a_list_and_retrieve_it_later (__main__.NewVisitorTest)
    ----------------------------------------------------------------------
    Traceback (most recent call last):
      File "functional_test.py", line 41, in test_can_start_a_list_and_retrieve_it_later
        self.assertTrue(
    AssertionError: False is not true
    
    ----------------------------------------------------------------------
    Ran 1 test in 5.742s
    
    ```
  - `assertTrue`는 현재 자세한 실패 메시지를 출력하고 있지 않다.
  - 대부분의 assertXXX 함수는 사용자 정의 메시지를 인수로 지정할 수 있다.
  
    ```python
    # functional_test.py
    
            table = self.browser.find_element_by_id('id_list_table')
            rows = table.find_elements_by_tag_name('tr')
            self.assertTrue(
                any(row.text == '1: 공작깃털 사기' for row in rows),
                "신규 작업 테이블에 표시되지 않는다."
            )
    ```
    - 이 문제는 사용자 폼(form) 제출 처리를 구현해야 한다.