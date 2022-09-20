---
title: 👯 git fetch
date: 2022-09-20 22:09:06
category: Git
thumbnail: { thumbnailSrc }
draft: false
---
# Contents
- [Contents](#contents)
- [`git pull`과 `git fetch`](#git-pull과-git-fetch)
  - [`git pull`](#git-pull)
  - [`git fetch`](#git-fetch)
- [`git fetch` & `merge` 예시](#git-fetch--merge-예시)
- [참고](#참고)

# `git pull`과 `git fetch`
- 공통점 : 원격 저장소(remote repository)의 정보 가져옴
- 용어
  - 원격 저장소(remote repository) == 리모트 저장소
  - 지역 저장소(local repository) == 로컬 브랜치

## `git pull`
- 원격 저장소의 커밋을 가져와서 무조건 지역 저장소와 합침
- 리모트 저장소 브랜치에서 데이터를 가져올 뿐만 아니라 자동으로 로컬 브랜치와 Merge

## `git fetch`
- `fetch` : 불러오다, 가져오다 라는 뜻
- 원격 저장소의 변화 내용 확인 후 그 정보만 지역 저장소로 가져옴
- git fetch 명령은 리모트 저장소의 데이터를 모두 로컬로 가져오지만, 자동으로 Merge 하지 않는다. 
- 따라서 로컬에서 하던 작업을 정리하고 나서 직접 Merge
- (사용 예시) 팀 작업 시 다른 사람이 수정한 소스 코드 훑어보고 지역 저장소와 합치고 싶을 때

# `git fetch` & `merge` 예시
- 예제
  - `remote branch` : origin/feat/example-fetch
  - `local branch` : feat/example-fetch

1. 지역 저장소인 `feat/example-fetch`에서 `git fetch` 실행
    ```shell
    $ git checkout feat/example-fetch
    $ git fetch
    ```


2. 커밋 해시 HEAD로 원격 저장소와 지역 저장소 최종 커밋 정보 확인
   ```shell
   $ git log --oneline
   7113245(HEAD -> feat/example-fetch) add something
   ``` 
   - 원격 저장소의 최신 커밋 정보를 가져왔지만 아직 지역 저장소에 합치지 않아 지역 저장소의 feat/example-fetch만 확인 됨


3. git status 입력하면 현재 브랜치(feat/example-fetch)가 원격브랜치(origin/feat/example-fetch)에 비해 1개 커밋 뒤쳐져 있다고 나옴
    ```shell
    $ git status
    Your branch is behind 'origin/feat/example-fetch' by 1 commit, and can be fast-forwarded.
    (usw "git pull" to update your local branch)
    ```
    - 원격 저장소의 최신 커밋 하나가 아직 지역 저장소에 반영되지 않았다는 뜻

4. 지역 저장소(`feat/example-fetch`)의 최신 커밋과 `fetch` 커밋 내용 비교 및 확인
    ```shell
    $ git diff HEAD origin/feat/example-fetch 
    ```
    - fetch로 가져온 원격 저장소 정보는 FETCH_HEAD라는 브랜치로 가져옴

5. Fetch 내용 로컬 브랜치에 병합
   ```shell
   $ git merge origin/feat/example-fetch
   ```
   - 이 때, `git pull`(원격 저장소 소스 내려받기) 또는 
   - `git merge`(fetch 커밋 병합) 가능

# 참고
- [git 공식문서](https://git-scm.com/book/ko/v2/Git%EC%9D%98-%EA%B8%B0%EC%B4%88-%EB%A6%AC%EB%AA%A8%ED%8A%B8-%EC%A0%80%EC%9E%A5%EC%86%8C)
- [깃 & 깃허브 입문](http://www.kyobobook.co.kr/product/detailViewKor.laf?mallGb=KOR&ejkGb=KOR&barcode=9791163031222)
- [누구나 쉽게 이해할 수 있는 Git 입문](https://backlog.com/git-tutorial/kr/stepup/stepup3_2.html)

