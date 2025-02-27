---
title: ✅ sql error - 따옴표
date: "2025-02-04T15:40:32.169Z"
description: API를 이용해 데이터 수집 후 DB 적재 시 발생한 SQL의 따옴표 syntax 오류
---
airflow를 이용하여 매일 자정 공연 데이터를 수집하는 DAG 작성 중 발생한 오류

# Contents
[문제 상황 1](#문제-상황-1.)<br>
[문제 상황 2](#문제-상황-2.)

# 문제 상황 1.
데이터 변환 후 SQL bulk insert을 위해 python의 `f-string`으로 처리하면서 문자열과 날짜 값을 모두 쌍따옴표로 처리
    
```python
records = []
...
records.append(
    f'("{box_office_date}",{ranking},"{performance_id}","{performance_name}","{genre}",{performance_count},"{area}")'
)
```

```python
insert_sql = f"INSERT INTO t VALUES " + ",".join(records)
```
    
변환한 데이터를 redshift에 적재하니 아래 에러 발생
    
```sql
(psycopg2.errors.UndefinedColumn) column "2025-02-01 00:00:00" does not exist in box_office
```
    

bulk insert 문에 컬럼을 적어도 같은 에러 발생
    
```python
insert_sql = f"INSERT INTO t (box_office_date,ranking,performance_id,performance_name,genre,performance_count,area) VALUES " + ",".join(records)
```

```sql
-- SQL 실행
INSERT INTO box_office 
    (box_office_date,ranking,performance_id,performance_name,genre,performance_count,area) 
VALUES 
    ("2025-02-01 00:00:00",1,"PF258148","ATEEZ WORLD TOUR: TOWARDS THE LIGHT: WILL TO POWER [서울]","대중음악",2,"서울"),
    ("2025-02-01 00:00:00",2,"PF254693","웃는 남자","뮤지컬",29,"서울");
```
    

## 오류 원인

- SQL 쿼리에서 `VALUES` 안에 문자열이나 날짜 값에 쌍따옴표(`"`) 대신 홑따옴표(`'`)를 사용
- PostgreSQL에서는
    - **쌍따옴표**는 컬럼 또는 식별자를 나타내는 데 사용
    - **홑따옴표**로 문자열과 날짜 값을 감싸야 함

## 오류 수정

`f-string` 를 쌍따옴표로 하고 문자열은 홑따옴표로 처리

```python
records = []
...
records.append(
	f"('{box_office_date}',{ranking},'{performance_id}','{performance_name}','{genre},{performance_count},'{area}')"
)
```

# 문제 상황 2.

문제 상황1은 해결 되었지만 airflow DAG 실행 시 실패하는 DAG 발생
    
```python
psycopg2.errors.SyntaxError: syntax error at or near "t" in context "49,'PF257672','THE SKYSCRAPER: Can't", at line 1
LINE 1: ...,('2025-01-21',49,'PF257672','THE SKYSCRAPER: Can't be blue,...
```
    

## 오류 원인

홑따옴표가 포함된 문자열에 대한 처리가 없어서 생긴 오류
    
```
THE SKYSCRAPER: Can't be blue, PATZ, kimseungjoo
```
    
홑따옴표 두 개(`''`)를 사용하여 문자열 내에 홑따옴표를 포함
    
```sql
INSERT INTO box_office 
VALUES 
('2025-02-01 00:00:00', 3, 'PF123456', 'Can''t stop', '뮤지컬', 5, '서울');
```
    

## 오류 수정

데이터 변환 시 문자열에 홑따옴표가 있는지 확인하는 python 로직 추가
    
```python
if "'" in performance_name: # (e.g) Can't be blue
    performance_name = performance_name.replace("'", "''")
```