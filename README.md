## 프로젝트를 구동하기 위하여

### 패키지 설치

패키지들을 다운받습니다.
```bash
npm install
```

### json-server 실행

mock Data JSON으로부터 값을 가져오기 위해 json server를 실행시킵니다.
3000번 포트에서 실행됩니다.
```bash
npm run json
```

혹은 3001번 포트에서 실행시키고 싶다면 하단의 명령어를 입력합니다.
```bash
npm run test-json
```

### dev 서버 실행

development 서버를 실행시킵니다.
80번 포트에서 실행됩니다.
```bash
npm run dev
```

## Todo List

01. 각 필터에서 렌더링 할 템플릿을 별개의 컴포넌트로 분리
02. sass와 sass-loader를 설치하여 scss 파일로 CSS 정의
03. className을 보다 더 직관적이게 변경, 혹은 flex, justify-center 등이 정의된 CSS파일을 생성
04. input과 button 등의 자주 사용하는 요소 컴포넌트화