---
title: '📚 Tiny Python Project 01 : : 파이썬 프로그램 작성 및 테스트 방법'
date: 2022-04-24
category: 공부
thumbnail: { thumbnailSrc }
draft: false
---
## Pytest
- 테스트용 모든 명령을 자동으로 실행
- 몇 개의 테스트를 진행해서 맻 개가 성공했는지 알려줌
```
pytest -xv test.py (or -vx)
```
- `-v` : 상세한 테스트 결과 보여줌
- `-x` : 테스트가 실패한 시점에 바로 중단

## #!(셔뱅_shebang)
- 어떤 언어로 텍스트 파일을 실행할지 지정해 주는 것
```
#! /usr/bin/env/python3
```

## OS에서 프로그램 바로 실행
- chmod(change mode) 명령을 통해 프로그램을 '실행 가능'하게 만들어야 함
```commandline
chmod +x hello.py
```

## $PATH
### 개념
- OS가 특정 프로그램을 찾기 위해 사용하는 디렉터리들의 집합
- 컴퓨터가 실행 가능한 프로그램을 어디에서 찾아야 하는지 알려주는 방법
- 이 디렉터리는 콜론(`:`)으로 연결, 긴 문자열은 중간에 \ 넣어 읽기 쉽게 함
- 대부분의 프로그램은 `/usr/local/bin`에 설치 됨
### 변경
- `$PATH` 디렉터리에 프로그램 설치할 수 없는 경우
- `$PATH`에 작성한 프로그램이 있는 곳의 경로 추가

## 코드 서식(code format)
- 코드를 읽기 쉬운 형태로 만들어 준다
- PEP 8의 서식에 따라 대부분의 Python IDE는 코드 서식을 맞춘다
- YAPF, Black

## 코드 린터
- 코드 상 문제를 찾아 주는 도구
- 예) 선언 됐지만 사용 되고 있지 않는 변수 등
- pylint, flake8, mypy
