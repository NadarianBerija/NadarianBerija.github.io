 //Проверим готовность документа
        $(function() {
            //Отлавливаем события "Нажатие на клавишу"
            $(this).keydown(function(event) {
                //Создаем переменную, в которую помещаем div с подходящим data-key
                var key = $(this).find('.key[data-key='+event.which+']');
                //Находим на странице тег audi с нужным data-key и помещаем также в переменную для удобства
                var audio = $(this).find('audio[data-key='+event.which+']')[0];
                //Присвиваем активный класс к клавише, чтобы подстветить ее
                key.toggleClass('playing');
                //проверяем существует ли audio тег с таким data-key
                if (!audio) return;
                //Воспроизводим звук
                audio.play();
                //Сбарсываем таймер звуковой дорожкой снова на 0
                audio.currentTime = 0;
            });
            //Отслеживаем событие, когда пользователь отпускает кнопку
            $(this).keyup(function(event) {
                //снова создаем переменную с нужным data-key
                var key = $(this).find('.key[data-key='+event.which+']');
                //Убираем класс, который подсвечивает кнопку
                key.toggleClass('playing');
            });
        });