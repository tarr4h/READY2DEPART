###READY2DEPART

1. nodejs 설치
    - https://nodejs.org/ko
2. npm install
    - npm install
3. npm update
    - npm update
4. react-script
    - $ npm install -g react-script

npm start 확인

1. yarn 설치
    - npm install -g yarn

1. mac - window 호환
    - cross-env 모듈 설치 : $ **npm install --save-dev cross-env**
    - package.json → “scripts”에 cross-env 추가

2. local  환경 https 세팅
    - WINDOW : CHOCO 통해서 MKCERT 설치
    - MAC : brew install mkcert
    - 소스 디렉토리에서 mkcert 설치 후 local ssl인증서 생성(cert.pem, key.pem)

    ```
    $ mkcert -install
    $ mkcert localhost 127.0.0.1 ::1
    ```

    - script에 조건 추가
        - HTTPS=true SSL_CRT_FILE=cert.pem SSL_KEY_FILE=key.pem react-scripts start
3. github에서 clone 후 npm start  에러 시 해결
    1. `npm install -g npm@latest` to update npm because it is sometimes buggy.
    2. `rm -rf node_modules` to remove the existing modules.
    3. `npm install` to re-install the project dependencies.
4. axios 설치
    - $ npm i axios