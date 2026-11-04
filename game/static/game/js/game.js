document.addEventListener(
    "DOMContentLoaded",
    function () {

        // =========================
        // 要素取得
        // =========================
        const resultDogImage =
            document.getElementById(
                "result-dog-image"
            );

        const titleScreen =
            document.getElementById(
                "title-screen"
            );

        const gameScreen =
            document.getElementById(
                "game-screen"
            );

        const gameStartButton =
            document.getElementById(
                "game-start-button"
            );

        const roundNumberElement =
            document.getElementById(
                "round-number"
            );

        const commandText =
            document.getElementById(
                "command-text"
            );

        const gameMessage =
            document.getElementById(
                "game-message"
            );

        const goButton =
            document.getElementById(
                "go-button"
            );

        const roundResultScreen =
            document.getElementById(
                "round-result-screen"
            );

        const resultTitle =
            document.getElementById(
                "result-title"
            );

        const scoreResult =
            document.getElementById(
                "score-result"
            );

        const resultMessage =
            document.getElementById(
                "result-message"
            );

        const nextRoundButton =
            document.getElementById(
                "next-round-button"
            );

        const finalResultScreen =
            document.getElementById(
                "final-result-screen"
            );

        const finalRank =
            document.getElementById(
                "final-rank"
            );

        const finalRankMessage =
            document.getElementById(
                "final-rank-message"
            );

        const averageScore =
            document.getElementById(
                "average-score"
            );

        const fastestScore =
            document.getElementById(
                "fastest-score"
            );

        const flyingCount =
            document.getElementById(
                "flying-count"
            );

        const finalRoundResults =
            document.getElementById(
                "final-round-results"
            );

        const retryButton =
            document.getElementById(
                "retry-button"
            );

        const bestScoreElement  =
            document.getElementById(
                "best-score"
            );

        const backTitleButton =
            document.getElementById(
                "back-title-button"
            );

        const dogCharacter =
            document.getElementById(
                "dog-character"
            );

        const treat =
            document.getElementById(
                "treat"
            );

        const dogImage =
            document.getElementById(
                "dog-image"
            );

        const dogImages = {

            wait:
                "/static/game/images/dog_wait.png",

            fake:
                "/static/game/images/dog_fake.png",

            run1:
                "/static/game/images/dog_run_1.png",

            run2:
                "/static/game/images/dog_run_2.png",

            eat:
                "/static/game/images/dog_eat.png"

        };

        const eatMessage =
            document.getElementById(
                "eat-message"
            );

        const flyingMessage =
            document.getElementById(
                "flying-message"
            );

        // =========================
        // 犬画像変更
        // =========================

        function changeDogImage(
            imageName
        ) {

            dogImage.src =
                dogImages[imageName];

        }

        // =========================
        // 走る画像アニメーション開始
        // =========================

        function startRunAnimation() {

            let currentRunImage = 1;

            changeDogImage(
                "run1"
            );

            runAnimationId =
                window.setInterval(
                    function () {

                        if (currentRunImage === 1) {

                            changeDogImage(
                                "run2"
                            );

                            currentRunImage = 2;

                        } else {

                            changeDogImage(
                                "run1"
                            );

                            currentRunImage = 1;

                        }

                    },
                    120
                );

        }

        // =========================
        // 走る画像アニメーション停止
        // =========================

        function stopRunAnimation() {

            if (runAnimationId === null) {
                return;
            }

            clearInterval(
                runAnimationId
            );

            runAnimationId = null;

        }


        // =========================
        // ゲーム状態
        // =========================

        const totalRounds = 5;

        const flyingPenalty = 1.0;

        const fakeMessages = [
            "よ……",
            "よく待てました！",
            "よーし……",
            "もう少し！"
        ];

        function getFakeCount() {

            let maxFakeCount = 0;

            if (currentRound === 1) {

                maxFakeCount = 0;

            } else if (currentRound === 2) {

                maxFakeCount = 1;

            } else if (currentRound === 3) {

                maxFakeCount = 2;

            } else if (currentRound === 4) {

                maxFakeCount = 3;

            } else {

                maxFakeCount = 4;

            }

            return Math.floor(
                Math.random() *
                (maxFakeCount + 1)
            );

        }

        function getRandomFakeMessage() {

            const index =
                Math.floor(
                    Math.random() *
                    fakeMessages.length
                );

            return fakeMessages[index];

        }

        // =========================
        // フェイント処理
        // =========================

        function runFakeSequence(
            remainingFakeCount
        ) {

            if (remainingFakeCount <= 0) {

                /*
                最後は本物の「よし！」
                */
                const finalWait =
                    1000 +
                    Math.floor(
                        Math.random() * 1501
                    );

                waitTimerId =
                    window.setTimeout(
                        showGoSignal,
                        finalWait
                    );

                return;

            }


            /*
            次のフェイントまで
            */
            const fakeWait =
                1000 +
                Math.floor(
                    Math.random() * 1501
                );

            waitTimerId =
                window.setTimeout(
                    function () {

                        waitTimerId = null;

                        /*
                        フェイントなので
                        押してはいけない
                        */
                        isGoSignal = false;

                        commandText.textContent =
                            getRandomFakeMessage();

                        changeDogImage(
                            "fake"
                        );

                        dogCharacter.className =
                            "fake";

                        gameMessage.textContent =
                            "まだ押さないで！";


                        /*
                        少し見せてから
                        「待て！」へ戻す
                        */
                        waitTimerId =
                            window.setTimeout(
                                function () {

                                    waitTimerId = null;

                                    commandText.textContent =
                                        "待て！";

                                    gameMessage.textContent =
                                        "「よし！」まで待ってください";

                                    changeDogImage(
                                        "wait"
                                    );

                                    dogCharacter.className =
                                        "waiting";
                                    
                                    runFakeSequence(
                                        remainingFakeCount - 1
                                    );

                                },
                                1500
                            );

                    },
                    fakeWait
                );

        }

        const bestScoreStorageKey =
            "waitDogBestScore";

        let currentRound = 1;

        let bestScore = null;

        let roundResults = [];

        let waitTimerId = null;

        let runAnimationId = null;

        let isGoSignal = false;

        let signalStartTime = null;

        let isRoundFinished = false;

        // =========================
        // BEST SCORE読込
        // =========================

        function loadBestScore() {

            try {

                const savedValue =
                    localStorage.getItem(
                        bestScoreStorageKey
                    );

                if (savedValue === null) {
                    return null;
                }

                const parsedValue =
                    Number.parseFloat(
                        savedValue
                    );

                if (
                    Number.isFinite(parsedValue) &&
                    parsedValue >= 0
                ) {
                    return parsedValue;
                }

            } catch (error) {

                console.warn(
                    "BEST SCOREを読み込めませんでした。",
                    error
                );

            }

            return null;

        }

        // =========================
        // BEST SCORE表示
        // =========================

        function updateBestScoreDisplay() {

            if (bestScore === null) {

                bestScoreElement.textContent =
                    "🏆 ---";

                return;

            }

            bestScoreElement.textContent =
                "🏆 " +
                bestScore.toFixed(3) +
                "秒";

        }

        // =========================
        // BEST SCORE保存
        // =========================

        function saveBestScore(value) {

            try {

                localStorage.setItem(
                    bestScoreStorageKey,
                    String(value)
                );

            } catch (error) {

                console.warn(
                    "BEST SCOREを保存できませんでした。",
                    error
                );

            }

        }

        // =========================
        // ランダム待ち時間
        // =========================

        function getRandomWaitTime() {

            const minWait = 2000;
            const maxWait = 5000;

            return Math.floor(
                Math.random() *
                (maxWait - minWait + 1)
            ) + minWait;

        }

        // =========================
        // 「よし！」を表示
        // =========================

        function showGoSignal() {
            waitTimerId = null;

            isGoSignal = true;

            commandText.textContent =
                "よし！";

            commandText.className =
                "success";

            gameMessage.textContent =
                "今だ！ボタンを押して！";

            dogCharacter.className =
                "ready";

            signalStartTime =
                performance.now();

        }

        // =========================
        // ROUND RESULT表示
        // =========================

        function showRoundResult(
            title,
            result,
            message
        ) {

            resultTitle.textContent =
                title;

            scoreResult.textContent =
                result;

            resultMessage.textContent =
                message;

            if (title === "フライング！") {

                resultDogImage.src =
                    dogImages.fake;

                resultTitle.classList.add(
                    "flying"
                );

            } else {

                resultDogImage.src =
                    dogImages.eat;

                resultTitle.classList.remove(
                    "flying"
                );

            }
            gameScreen.hidden = true;

            roundResultScreen.hidden = false;

        }

        // =========================
        // 最終ランク判定
        // =========================

        function getFinalRank(
            average,
            flying
        ) {

            if (
                flying === 0 &&
                average <= 0.450
            ) {
                return {
                    rank: "S+",
                    message: "完璧なコンビ！"
                };
            }

            if (
                flying === 0 &&
                average <= 0.550
            ) {
                return {
                    rank: "S",
                    message: "息ぴったり！"
                };
            }

            if (
                flying <= 1 &&
                average <= 0.700
            ) {
                return {
                    rank: "A",
                    message: "かなり上手に待てました！"
                };
            }

            if (
                flying <= 2 &&
                average <= 0.850
            ) {
                return {
                    rank: "B",
                    message: "いいコンビ！"
                };
            }

            return {
                rank: "C",
                message: "もう一度チャレンジ！"
            };

        }

        // =========================
        // FINAL RESULT表示
        // =========================

        function showFinalResult() {

            /*
            成功したROUNDだけ取り出す
            */
            const successfulResults =
                roundResults.filter(
                    function (result) {

                        return !result.isFlying;

                    }
                );


            /*
            フライング回数
            */
            const flyingTotal =
                roundResults.filter(
                    function (result) {

                        return result.isFlying;

                    }
                ).length;


            /*
            5ROUNDの合計タイム
            フライングは1.000秒として計算
            */
            const totalScoreTime =
                roundResults.reduce(
                    function (total, result) {

                        if (result.isFlying) {

                            return (
                                total +
                                flyingPenalty
                            );

                        }

                        return (
                            total +
                            result.reactionTime
                        );

                    },
                    0
                );


            /*
            5ROUNDの平均スコア
            */
            const average =
                totalScoreTime /
                roundResults.length;


            /*
            BEST SCORE判定
            数字が小さい方が好記録
            */
            const isNewBestScore =
                bestScore === null ||
                average < bestScore;

            if (isNewBestScore) {

                bestScore =
                    average;

                saveBestScore(
                    bestScore
                );

                updateBestScoreDisplay();

            }


            /*
            成功したROUNDの最速反応
            */
            let fastest = null;

            if (successfulResults.length > 0) {

                fastest =
                    Math.min(
                        ...successfulResults.map(
                            function (result) {

                                return result.reactionTime;

                            }
                        )
                    );

            }


            /*
            ランク判定
            */
            const rankResult =
                getFinalRank(
                    average,
                    flyingTotal
                );


            /*
            最終結果を表示
            */
            finalRank.textContent =
                rankResult.rank;

            finalRankMessage.textContent =
                rankResult.message;

            averageScore.textContent =
                average.toFixed(3) +
                "秒";

            fastestScore.textContent =
                fastest === null
                    ? "---"
                    : fastest.toFixed(3) +
                    "秒";

            flyingCount.textContent =
                flyingTotal +
                "回";


            /*
            各ROUND結果
            */
            finalRoundResults.innerHTML = "";

            roundResults.forEach(
                function (result) {

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "round-result-row";

                    if (result.isFlying) {
                        row.classList.add(
                            "flying"
                        );

                        row.textContent =
                            "ROUND " +
                            result.round +
                            "　フライング！ " +
                            "（" +
                            flyingPenalty.toFixed(3) +
                            "秒）";

                    } else {

                        row.classList.add(
                            "success"
                        );

                        row.textContent =
                            "ROUND " +
                            result.round +
                            "　" +
                            result.reactionTime.toFixed(
                                3
                            ) +
                            "秒";

                    }

                    finalRoundResults.appendChild(
                        row
                    );

                }
            );


            /*
            FINAL RESULTへ切り替え
            */
            gameScreen.hidden = true;

            roundResultScreen.hidden = true;

            finalResultScreen.hidden = false;

        }

        // =========================
        // 次のROUNDへ
        // =========================

        function goToNextRound() {

            if (currentRound >= totalRounds) {

                showFinalResult();

                return;

            }

            currentRound += 1;

            roundResultScreen.hidden = true;

            gameScreen.hidden = false;

            startRound();

        }

        // =========================
        // 成功アニメーション
        // =========================

        function playSuccessAnimation(
            reactionSeconds
        ) {

            /*
            走る画像を切り替え開始
            */
            startRunAnimation();


            /*
            犬がおやつへ移動
            */
            dogCharacter.className =
                "running";


            /*
            走り終わるまで待つ
            */
            window.setTimeout(
                function () {

                    /*
                    走る画像切り替え停止
                    */
                    stopRunAnimation();


                    /*
                    食べる画像へ
                    */
                    changeDogImage(
                        "eat"
                    );

                    /*
                    ぱくっ！表示
                    */
                    eatMessage.hidden = false;

                    eatMessage.className =
                        "show";


                    /*
                    食べる動き
                    */
                    dogCharacter.className =
                        "eating";

                    treat.className =
                        "eaten";


                    /*
                    食べる演出を見せる
                    */
                    window.setTimeout(
                        function () {

                            showRoundResult(
                                "GOOD！",
                                reactionSeconds.toFixed(3) +
                                "秒",
                                "上手に待てました！"
                            );

                        },
                        800
                    );

                },
                800
            );

        }

        // =========================
        // フライングアニメーション
        // =========================

        function playFlyingAnimation() {

            /*
            フェイント画像へ
            */
            changeDogImage(
                "fake"
            );


            /*
            犬のフライング演出
            */
            dogCharacter.className =
                "flying";


            /*
            「あっ！」表示
            */
            flyingMessage.hidden =
                false;

            flyingMessage.className =
                "show";


            /*
            ROUND RESULTへ
            */
            window.setTimeout(
                function () {

                    showRoundResult(
                        "フライング！",
                        "---",
                        "まだ「よし！」じゃないよ！"
                    );

                },
                800
            );

        }


        // =========================
        // 「よし！」ボタン判定
        // =========================

        function handleGoButton() {
            if (isRoundFinished) {
                return;
            }

            isRoundFinished = true;

            /*
            まだ「よし！」が出ていない
            → フライング
            */
            if (!isGoSignal) {

                if (waitTimerId !== null) {

                    clearTimeout(
                        waitTimerId
                    );

                    waitTimerId = null;

                }


                /*
                フライング結果を保存
                */
                roundResults.push({
                    round: currentRound,
                    reactionTime: null,
                    isFlying: true
                });

                dogCharacter.className =
                    "running";


                playFlyingAnimation();

                return;

            }


            /*
            「よし！」が出た後
            → 反応速度を計測
            */
            const reactionTime =
                performance.now() -
                signalStartTime;

            const reactionSeconds =
                reactionTime / 1000;


            /*
            ROUND結果を保存
            */
            roundResults.push({
                round: currentRound,
                reactionTime:
                    reactionSeconds,
                isFlying: false
            });


            /*
            ROUND終了
            */
            isGoSignal = false;

            signalStartTime = null;


            /*
            結果表示
            */
            playSuccessAnimation(
                reactionSeconds
            );
        }

        // =========================
        // ROUND開始
        // =========================

        function startRound() {

            stopRunAnimation();

            /*
            前ROUNDの待機タイマーを必ず停止
            */
            if (waitTimerId !== null) {

                clearTimeout(
                    waitTimerId
                );

                waitTimerId = null;

            }

            changeDogImage(
                "wait"
            );

            roundNumberElement.textContent =
                "ROUND " +
                currentRound +
                " / " +
                totalRounds;

            isGoSignal = false;

            signalStartTime = null;

            isRoundFinished = false;

            commandText.textContent =
                "待て！";

            commandText.className = "";

            dogCharacter.className =
                "waiting";

            changeDogImage(
                "wait"
            );

            eatMessage.hidden = true;

            eatMessage.className = "";

            flyingMessage.hidden = true;

            flyingMessage.className = "";

            treat.className = "";

            gameMessage.textContent =
                "「よし！」まで待ってください";

            const fakeCount =
                getFakeCount();


            if (fakeCount === 0) {

                /*
                ROUND1・2
                今まで通り
                */
                const waitTime =
                    getRandomWaitTime();

                waitTimerId =
                    window.setTimeout(
                        showGoSignal,
                        waitTime
                    );

            } else {

                /*
                ROUND3以降
                フェイント開始
                */
                runFakeSequence(
                    fakeCount
                );

            }

        }

        // =========================
        // タイトルへ戻る
        // =========================

        function backToTitle() {

            stopRunAnimation();

            /*
            待機タイマーが残っていたら停止
            */
            if (waitTimerId !== null) {

                clearTimeout(
                    waitTimerId
                );

                waitTimerId = null;

            }


            /*
            ゲーム状態をリセット
            */
            currentRound = 1;

            roundResults = [];

            isGoSignal = false;

            signalStartTime = null;


            /*
            画面切り替え
            */
            titleScreen.hidden = false;

            gameScreen.hidden = true;

            roundResultScreen.hidden = true;

            finalResultScreen.hidden = true;


            /*
            BEST SCORE表示更新
            */
            updateBestScoreDisplay();

        }

        // =========================
        // ゲーム開始
        // =========================
        function startGame() {

            currentRound = 1;

            /*
            前回のROUND結果をリセット
            */
            roundResults = [];

            /*
            前回のFINAL RESULT表示をリセット
            */
            finalRoundResults.innerHTML = "";

            finalRank.textContent = "---";

            finalRankMessage.textContent = "";

            averageScore.textContent = "---";

            fastestScore.textContent = "---";

            flyingCount.textContent = "0回";


            /*
            画面切り替え
            */
            nextRoundButton.disabled =
                false;

            titleScreen.hidden = true;

            roundResultScreen.hidden = true;

            finalResultScreen.hidden = true;

            gameScreen.hidden = false;


            /*
            ROUND 1開始
            */
            startRound();

        }


        // =========================
        // イベント登録
        // =========================

        gameStartButton.addEventListener(
            "click",
            startGame
        );

        goButton.addEventListener(
            "click",
            handleGoButton
        );

        nextRoundButton.addEventListener(
            "click",
            goToNextRound
        );

        retryButton.addEventListener(
            "click",
            startGame
        );

        backTitleButton.addEventListener(
            "click",
            backToTitle
        );

        // =========================
        // 初期表示
        // =========================

        bestScore =
            loadBestScore();

        updateBestScoreDisplay();


    }
);