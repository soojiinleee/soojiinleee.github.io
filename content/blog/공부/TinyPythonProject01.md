---
title: 'π Tiny Python Project 01 : : νμ΄μ¬ νλ‘κ·Έλ¨ μμ± λ° νμ€νΈ λ°©λ²'
date: 2022-04-24
category: κ³΅λΆ
thumbnail: { thumbnailSrc }
draft: false
---
## Pytest
- νμ€νΈμ© λͺ¨λ  λͺλ Ήμ μλμΌλ‘ μ€ν
- λͺ κ°μ νμ€νΈλ₯Ό μ§νν΄μ λ§» κ°κ° μ±κ³΅νλμ§ μλ €μ€
```
pytest -xv test.py (or -vx)
```
- `-v` : μμΈν νμ€νΈ κ²°κ³Ό λ³΄μ¬μ€
- `-x` : νμ€νΈκ° μ€ν¨ν μμ μ λ°λ‘ μ€λ¨

## #!(μλ±_shebang)
- μ΄λ€ μΈμ΄λ‘ νμ€νΈ νμΌμ μ€νν μ§ μ§μ ν΄ μ£Όλ κ²
```
#! /usr/bin/env/python3
```

## OSμμ νλ‘κ·Έλ¨ λ°λ‘ μ€ν
- chmod(change mode) λͺλ Ήμ ν΅ν΄ νλ‘κ·Έλ¨μ 'μ€ν κ°λ₯'νκ² λ§λ€μ΄μΌ ν¨
```commandline
chmod +x hello.py
```

## $PATH
### κ°λ
- OSκ° νΉμ  νλ‘κ·Έλ¨μ μ°ΎκΈ° μν΄ μ¬μ©νλ λλ ν°λ¦¬λ€μ μ§ν©
- μ»΄ν¨ν°κ° μ€ν κ°λ₯ν νλ‘κ·Έλ¨μ μ΄λμμ μ°ΎμμΌ νλμ§ μλ €μ£Όλ λ°©λ²
- μ΄ λλ ν°λ¦¬λ μ½λ‘ (`:`)μΌλ‘ μ°κ²°, κΈ΄ λ¬Έμμ΄μ μ€κ°μ \ λ£μ΄ μ½κΈ° μ½κ² ν¨
- λλΆλΆμ νλ‘κ·Έλ¨μ `/usr/local/bin`μ μ€μΉ λ¨
### λ³κ²½
- `$PATH` λλ ν°λ¦¬μ νλ‘κ·Έλ¨ μ€μΉν  μ μλ κ²½μ°
- `$PATH`μ μμ±ν νλ‘κ·Έλ¨μ΄ μλ κ³³μ κ²½λ‘ μΆκ°

## μ½λ μμ(code format)
- μ½λλ₯Ό μ½κΈ° μ¬μ΄ ννλ‘ λ§λ€μ΄ μ€λ€
- PEP 8μ μμμ λ°λΌ λλΆλΆμ Python IDEλ μ½λ μμμ λ§μΆλ€
- YAPF, Black

## μ½λ λ¦°ν°
- μ½λ μ λ¬Έμ λ₯Ό μ°Ύμ μ£Όλ λκ΅¬
- μ) μ μΈ λμ§λ§ μ¬μ© λκ³  μμ§ μλ λ³μ λ±
- pylint, flake8, mypy
