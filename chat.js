(function () {

    var updateDonation = function () {
        var donateDes = "## About Mirror-Chat \r\n" +
            "Mirror-Chat is an Intelligent conversation system whiich is based on ChatGPT3.0, it's able to think and reply most fo your questions such as the following scene:\r\n" +
            "- Writing an artile\r\n" +
            "- Fix bugs for your code\r\n" +
            "- Give you suggestions\r\n" +
            "- etc...\r\n\r\n" +
            "Mirror-Chat is growing, if you encounter any issues or get any ideas, welcome to write it down in the github [Mirror-Chat](https://github.com/ErikChanHub/Mirror-Chat/issues)\r\n" +
            "## About ChatGPT. \r\n" +
            "Open AI trained a model called ChatGPT which interacts in a conversational way. <br>The dialogue format makes it possible for ChatGPT to answer followup questions, <br>admit its mistakes, challenge incorrect premises, and reject inappropriate requests. \r\n" +
            "\r\nChatGPT is a sibling model to InstructGPT, which is trained to follow an instruction in a prompt and provide a detailed response.We are excited to introduce ChatGPT to get users’ feedback and learn about its strengths and weaknesses. During the research preview, usage of ChatGPT is free. Try it now at chat.openai.com.\r\n" +
            "## How to donate \r\n Please follow the steps below:\r\n" +
            "- scan the qrcode below with wechat\r\n" +
            "- input whatever you'd like\r\n" +
            "- finish donation\r\n\r\n" +
            "Thanks for your donation, hope you a greate time in this journey.";
        $('.donate_des').html(marked.parse(donateDes));
    };

    var Message;

    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = (function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(marked.parse(_this.text));
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        })(this);
        return this;
    };

    $(function () {
        var getMessageText, message_side, sendMessage, replayMsg;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, isQuestion) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 300);
            if (isQuestion) {
                replayMsg(text);
            }
        };
        replayMsg = function (data) {
            var $loading = $($('.message_loading').clone().html());
            $loading.addClass('appeared');
            $loading.addClass('loading_cloned');
            $('.messages').append($loading);
            
            let xhr = new XMLHttpRequest(); // 创建XHR对象
            xhr.open( // 打开链接
                "post",
                "https://api.openai.com/v1/chat/completions", // 后端地址
                true
            );
            xhr.setRequestHeader("Content-Type", "application/json"); // 设置请求头
            xhr.setRequestHeader("Authorization", "Bearer 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"); // 设置请求头
            var form = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": data}],
                "max_tokens": 1024,
                "temperature": 0
            }
            xhr.send(JSON.stringify(form));

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) { // 4表示此次请求结束
                    var response  = xhr.responseText;
                    console.log("后端返回的结果：" + response);
                    $('.loading_cloned').remove();
                    if(!response){
                        sendMessage("这个问题我没听懂, 可以重新描述一下吗?", false);
                        return;
                    }
                    let result = JSON.parse(xhr.responseText);// 后端返回的结果为字符串，这里将结果转换为json
                    sendMessage(result.choices[0].message.content, false);
                }
            };
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText(), true);
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText(), true);
            }
        });
        sendMessage('您可以问我任何问题，知无不言，言无不尽 (请确认您的网络连接是科学的)');
        updateDonation();
    });

    const divs = document.getElementsByClassName("el-overlay");
    var div = divs[0];
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
           var isHidden =  $('.el-overlay').is(":hidden");
           if(!isHidden){
            updateDonation();
           }
        });
    });

    observer.observe(div, { attributes: true, attributeFilter: ["style"] });

}).call(this);