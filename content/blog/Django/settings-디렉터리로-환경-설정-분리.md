---
title: 📁 settings 디렉터리로 환경별 설정 관리하기
date: 2023-02-20 22:02:31
category: Django
thumbnail: { thumbnailSrc }
draft: false
---
# Contents
- [1. settings.py 이동](#1-settingspy-이동)
  - [1-1. `config` 하위에 settings 디렉토리 생성](#1-1-config-하위에-settings-디렉토리-생성)
  - [1-2. settings.py를 settings 디렉토리로 이동 및 이름 변경](#1-2-settingspy를-settings-디렉토리로-이동-및-이름-변경)
- [2. 환경별 설정 파일 생성](#2-환경별-설정-파일-생성)
  - [2-2. `base.py`의 `BASE_DIR` 수정](#2-2-basepy-의-basedir-수정)
  - [2-3. `dev.py` 등에 아래 설정 추가](#2-3-devpy-등에-아래-설정-추가)
- [3. 프로젝트 기본 setting 파일 설정 ](#3-프로젝트-기본-setting-파일-설정)
- [4. django `shell`에서 확인하기](#4-django-shell-에서-확인하기)
  - [4-1. `shell` 에서 `BASE_DIR` 출력](#4-1-shell-에서-basedir-출력)
  - [4-2. 오류](#4-2-오류)



# 1. settings.py 이동
- `django-admin startproject (프로젝트 이름 / 예:config) .` 명령어를 통해 프로젝트 생성 후 
- `config`(프로젝트 이름 디렉토리)에 settings.py 파일 자동으로 생성 됨
    ```text
  .
  ├── config
  │   ├── __init__.py
  │   ├── asgi.py
  │   ├── settings.py
  │   ├── urls.py
  │   └── wsgi.py
  └── manage.py
    ```
### 1-1. `config` 하위에 settings 디렉토리 생성
```shell
cd config
mkdir settings
```
### 1-2. settings.py를 settings 디렉토리로 이동 및 이름 변경
```shell
mv settings.py settings/base.py

# git add 완료된 경우 git mv 명령어로 수정
```
- `base.py` 혹은 `common.py` 등


# 2. 환경별 설정 파일 생성
### 2-1. 각 환경 별 세팅 파일 생성
```shell
touch dev.py
touch prod.py
touch test.py
```
### 2-2. `base.py`의 `BASE_DIR` 수정
```python
# 1. Path 이용하는 방법(Django 3.xx 이상 기본)
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


# 2. dirname 이용하는 방법
from os.path import abspath, dirname

BASE_DIR = dirname(dirname(dirname(abspath(__file__))))

```
### 2-3. `dev.py` 등에 아래 설정 추가
```python
from .base import *

# prod.py는 DEBUG 설정 추가
DEBUG = False
```
<br>
<br>

여기까지 완료 했으면 디렉토리 구조는 아래와 같이 나온다
```text
.
├── config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings
│   │    └── base.py
│   │    └── dev.py
│   │    └── prod.py
│   ├── urls.py
│   └── wsgi.py
└── manage.py
```


# 3. 프로젝트 기본 setting 파일 설정 
### 3-1. `manage.py`에서 `setdefault`의 기본 설정 경로를 수정 (✨중요)
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
```


# 4. django `shell`에서 확인하기
### 4-1. `shell` 에서 `BASE_DIR` 출력
```shell
$ from django.conf import settings
$ print(settings.BASE_DIR)

/Users/soojin/Develop/test        # BASE_DIR의 경로 출력
```


### 4-2. 오류
```shell
$ from django.conf import settings
$ print(settings.BASE_DIR)

Traceback (most recent call last):
  File "<console>", line 1, in <module>
#!/usr/bin/env python
  File "/Users/soojin/Develop/test/.venv/lib/python3.11/site-packages/django/conf/__init__.py", line 94, in __getattr__
    val = getattr(_wrapped, name)
          ^^^^^^^^^^^^^^^^^^^^^^^
```
- 프로젝트 환경 설정을 찾을 수 없기 때문에 `runserver`, `migrate` 등 명령어가 작동하지 않는다.
- 이런 오류가 나면 `manage.py`와 `base.py`의 `BASE_DIR` 경로를 다시 확인하기
