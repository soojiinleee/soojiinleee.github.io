---
title: 'π TDD Chapter 04 : `templates`μ μ΄μ©ν FT νμ€νΈ'
date: 2022-05-03
category: κ³΅λΆ
thumbnail: { thumbnailSrc }
draft: false
---
# μ¬μ©μ λ°μ νμ€νΈ (with `Selenium`)
κΈ°λ₯ νμ€νΈ νμΌ

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
        # μλμ€(Edith)λ λ©μ§ μμ λͺ©λ‘ μ¨λΌμΈ μ±μ΄ λμλ€λ μμμ λ£κ³ 
        # ν΄λΉ μΉ μ¬μ΄νΈλ₯Ό νμΈνλ¬ κ°λ€
        self.browser.get('http://localhost:8000')
        
        # μΉ νμ΄μ§ νμ΄νκ³Ό ν€λκ° 'To-Do'λ₯Ό νμνκ³  μλ€
        self.assertIn('To-Do', self.browser.title)
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('To-Do', header_text)

        # κ·Έλλ λ°λ‘ μμμ μΆκ°νκΈ°λ‘ νλ€
        inputbox = self.browser.find_element_by_id('id_new_item')
        self.assertEqual(
            inputbox.get_attribute('placehoder'),
            'μμ μμ΄ν μλ ₯'
        )
        # "κ³΅μκΉνΈ μ¬κΈ°"λΌκ³  νμ€νΈ μμμ μλ ₯νλ€
        # (μλμ€μ μ·¨λ―Έλ λ μΉ μ‘μ΄μ© κ·Έλ¬Όμ λ§λλ κ²μ΄λ€)
        inputbox.send_keys('κ³΅μκΉνΈ μ¬κΈ°')


        # μν°ν€λ₯Ό μΉλ©΄ νμ΄μ§κ° κ°±μ λκ³  μμ λͺ©λ‘μ
        # "1: κ³΅μκΉνΈμ¬κΈ°" μμ΄νμ΄ μΆκ°λλ€
        inputbox.send_keys(Keys.ENTER)

        table = self.browser.find_element_by_id('id_list_table')
        rows = table.find_elements_by_tag_name('tr')
        self.assertTrue(
            any(row.text == '1: κ³΅μκΉνΈ μ¬κΈ°' for row in rows),
        )

        # μΆκ° μμ΄νμ μλ ₯ν  μ μλ μ¬λΆμ νμ€νΈ μμκ° μ‘΄μ¬νλ€
        # λ€μ "κ³΅μκΉνΈμ μ΄μ©ν΄μ κ·Έλ¬Ό λ§λ€κΈ°"λΌκ³  μλ ₯νλ€(μλμ€λ λ§€μ° μ²΄κ³μ μΈ μ¬λμ΄λ€)
        self.fail('Finish the test!')

        # νμ΄μ§λ λ€μ κ°±μ λκ³ , λ κ° μμ΄νμ΄ λͺ©λ‘μ λ³΄μΈλ€
        # μλμ€λ μ¬μ΄νΈκ° μλ ₯ν λͺ©λ‘μ μ μ₯νκ³  μλμ§ κΆκΈνλ€
        # μ¬μ΄νΈλ κ·Έλλ₯Ό μν νΉμ  URLμ μμ±ν΄μ€λ€
        # μ΄ λ URLμ λν μ€λͺλ ν¨κ» μ κ³΅λλ€

        # ν΄λΉ URLμ μ μνλ©΄ κ·Έλκ° λ§λ  μμ λͺ©λ‘μ΄ κ·Έλλ‘ μλ κ²μ νμΈν  μ μλ€

        # λ§μ‘±νκ³  μ μλ¦¬μ λ λ€


if __name__ == '__main__':
    unittest.main(warnings='ignore')
```
- `selenium` μ κ³΅ λ©μλ :
  - `find_element_by_tag_name`, `find_element_by_id`, : νλμ μμλ§ λ°ν, μμκ° μλ κ²½μ° μμΈ λ°μ
  - `find_elements_by_tag_name` : λ¦¬μ€νΈ λ°ν, λ¦¬μ€νΈ λΉμ΄ μμ΄λ OK
- `send_keys` : `selenium`μ μλ ₯ μμλ₯Ό νμ΄ννλ λ°©λ²
- `Keys` ν΄λμ€ : Entersk Ctrl κ°μ νΉμ ν€ μλ ₯ μ μ‘

λ€μ κΈ°λ₯ νμ€νΈ(FT)λ₯Ό μ€ννλ©΄ `<h1>` μμλ₯Ό νμ΄μ§μμ μ°Ύμ§ λͺ» νλ€λ μλ¬κ° λ°μνλ€.
```python
selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: h1
```

HTMLμ λ¬Έμμ΄λ‘ νμ€νΈνλ κ²μ μμ νμ€νΈμ κ°λ€κ³  ν  μ μλ€. λ¨μ νμ€νΈλ λ‘μ§μ΄λ νλ¦ μ μ΄, μ€μ  λ±μ νμ€νΈνκΈ° μν κ²μ΄λ€.

μ νν μ΄λ€ κΈμλ€μ΄ HTML λ¬Έμμ΄μ λ°°μ΄λ μλμ§ μ²΄ν¬νλ κ²μ΄ μλ¬΄ μλ―Έκ° μλ€.

μ΄ κ²½μ° ννλ¦Ώμ μ΄μ©νλ κ²μ΄ ν¨μ¬ λμ μ κ·Όλ²μ΄λ€. HTMLμ `.html` νμ₯μμ νμΌ ννλ‘ λ³΄κ΄νμ¬ ν¨μ¨μ μΈ κ΅¬λ¬Έ κ²μ¦μ ν  μ μλ€.

## λ¦¬ν©ν°λ§(Refactoring)
### μ©μ΄
- λ¦¬ν©ν°λ§
  - "κΈ°λ₯(κ²°κ³Όλ¬Ό)μ λ°κΎΈμ§ μκ³ " μ½λ μμ²΄λ₯Ό κ°μ νλ μμμ΄λ€.
  - "κΈ°λ₯μ λ°κΎΈμ§ μκ³ "λΌλ κ²μ΄ ν΅μ¬μ΄λ€.
  - λ¦¬ν©ν λ§κ³Ό κΈ°λ₯ λ³κ²½μ μ ν λ€λ₯Έ κ°λμ΄λ€.

### κ·μΉ
- μ±μ½λμ νμ€νΈ μ½λλ₯Ό ν λ²μ μμ νλ κ²μ΄ μλλΌ νλμ© μμ ν΄μΌ νλ€.
- μμ λ¨κ³λ‘ λλμ΄ μμν΄μΌ νλ€.

`lists`μ±μ `templates` λΌλ ν΄λλ₯Ό λ§λ€κ³  μ¬κΈ°μ ννλ¦Ώ νμΌλ€μ μ μ₯νλ€.
```html
# lists/templates/home/html

<html>
    <title>To-Do lists</title>
</html>
```
`views.py`μμ ν¨μλ₯Ό μμ νλ€.
```python
# lists/views.py

from django.shortcuts import render

def home_page(request):
    return render(request, 'home.html')
```
- `render`ν¨μ
  - μ²« λ²μ§Έ μΈμλ‘ `request` μ μ§μ νκ³ , λ λ²μ§Έ μΈμλ‘ λ°λ°λ§ν  ννλ¦Ώλͺμ μ§μ νλ€.
  - `Django`λ μ± ν΄λ λ΄μ μλ `templates`μ΄λΌλ ν΄λλ₯Ό μλμΌλ‘ κ²μνλ€.
  - κ·Έλ¦¬κ³  ννλ¦Ώ μ½νμΈ λ₯Ό κΈ°λ°μΌλ‘ `HttpResponse`λ₯Ό λ§λ€μ΄μ€λ€.

μ΄λ κ² μμ νκ³  `python manage.py test`λ₯Ό μ€νμν€λ©΄, `render` λΆλΆμμ μλ¬κ° λ°μνλ€.
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

μμ§ μ±μ `Django`μ λ±λ‘νμ§ μμμ μλ¬κ° λ°μνλ€. `settings.py`μμ μ±μ μΆκ°νκ³  λ€μ νμ€νΈλ₯Ό μ€ν μν€λ©΄ μλ¬λ ν΄κ²°λλ€.

μ½λ λ¦¬ν©ν°λ§μ μλ£νλ€. μ΄μ  μμλ₯Ό νμ€νΈνλ κ²μ΄ μλ κ΅¬ν κ²°κ³Όλ¬Όμ λΉκ΅νλλ‘ λ¨μ νμ€νΈλ₯Ό μμ ν΄μΌ νλ€.

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
- `render_to_string` ν¨μλ₯Ό μ΄μ©ν΄ ννλ¦Ώ λ λλ§μ νμ€νΈ ν  μ μλ€.
- `.decode()`λ₯Ό μ΄μ©ν΄μ `response.content` λ°μ΄νΈ λ°μ΄ν°λ₯Ό νμ΄μ¬ μ λμ½λ λ¬Έμμ΄λ‘ λ³ννλ€. (λ¬Έμμ΄μ μλ‘ λΉκ΅)

### TDD νμ€νΈ - μ½λ μ£ΌκΈ°
μμ§ κΈ°λ₯ νμ€νΈ μ€ν¨λ₯Ό νκ³  μμΌλ―λ‘ μ½λλ₯Ό μμ ν΄μΌ νλ€. μ΄μ  HTMLμ΄ ννλ¦Ώ νν μ΄κΈ° λλ¬Έμ μΆκ°μ μΈ λ¨μ νμ€νΈ μμ΄ λ°λ‘ μμ ν  μ μλ€.
- μ½λ
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
- νμ€νΈ
    ```python
    selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: [id="id_new_item"]
    ```
- μ½λ : `<input>` μΆκ°
    ```html
    [...]
        <body>
            <h1>Your To-Do list</h1>
            <input id="id_new_item"/>
        </body>
    [...]
    ```
- νμ€νΈ
    ```python
    AssertionError: None != 'μμ μμ΄ν μλ ₯'
    ```
- μ½λ : placeholder νμ€νΈ μΆκ°
    ```html
        [...]
        <body>
            <h1>Your To-Do list</h1>
            <input id="id_new_item" placeholder="μμ μμ΄ν μλ ₯"/>
        </body>
        [...]
    ```
- νμ€νΈ : νμ΄λΈμ΄ μλ€λ μλ¬
    ```python
    selenium.common.exceptions.NoSuchElementException: Message: Unable to locate element: [id="id_list_table"]
    ```
- μ½λ
    ```html
            <body>
                <h1>Your To-Do list</h1>
                <input id="id_new_item" placeholder="μμ μμ΄ν μλ ₯" />
                <table id="id_list_table">
                </table>
            </body>
    ```
- νμ€νΈ
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
  - `assertTrue`λ νμ¬ μμΈν μ€ν¨ λ©μμ§λ₯Ό μΆλ ₯νκ³  μμ§ μλ€.
  - λλΆλΆμ assertXXX ν¨μλ μ¬μ©μ μ μ λ©μμ§λ₯Ό μΈμλ‘ μ§μ ν  μ μλ€.
  
    ```python
    # functional_test.py
    
            table = self.browser.find_element_by_id('id_list_table')
            rows = table.find_elements_by_tag_name('tr')
            self.assertTrue(
                any(row.text == '1: κ³΅μκΉνΈ μ¬κΈ°' for row in rows),
                "μ κ· μμ νμ΄λΈμ νμλμ§ μλλ€."
            )
    ```
    - μ΄ λ¬Έμ λ μ¬μ©μ νΌ(form) μ μΆ μ²λ¦¬λ₯Ό κ΅¬νν΄μΌ νλ€.