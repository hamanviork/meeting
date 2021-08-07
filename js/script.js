//Создаём класс для частиц
class Particle
{
   //Конструктор принимает положение частицы по трём осям и цвет
   constructor(x, y, z, color)
   {
       this.x = x;
       this.y = y;
       this.z = z;
 
       //Размытие и скорость зависят от положения частицы по оси Z
       //Чем выше частица, тем более размытой она будет и тем быстрее она будет двигаться
       let blurs = [ 0, 2, 1, 0 ];
 
       this.blur = blurs[z];
       this.speed = z;
       this.color = color;
   }
 
   //Метод движения частицы
   Move(d)
   {
       this.y += this.speed * d;
   }
}
 
//Позиция полосы прокрутки
let scrollPosition = 0;
 
//Получаем контейнер для частиц
const particlesContainer = document.getElementById("particles");
 
//Создаём массив с частицами
const particles =
[
   new Particle(1650, 450, 3, "#fff7f6"),
   new Particle(1700, 450, 1, "#fff7f6"),
   new Particle(220, 500, 3, "#fff7f6"),
   new Particle(600, 700, 1, "#fff7f6"),
   new Particle(900, 600, 4, "#fff7f6"),
   new Particle(1200, 900, 2, "#fff7f6"),
];
 
//Это функция вывода частицы на страницу
Fill();
 
//При каждой прокрутке вызываем функцию Scroll(), которая двигает частицы
window.addEventListener("scroll", function (e) { Scroll(e); });
 
function Scroll(e)
{
   //Определяем, в каком направлении была прокрутка
   let d = 0;
 
   if(window.pageYOffset > scrollPosition)
   {
       d = 1;
   }
   else
   {
       d = -1;
   }
  
   scrollPosition = window.pageYOffset;
 
   //Двигаем все частицы в заданном направлении
   for(let i = 0; i < particles.length; i++)
   {
       particles[i].Move(d);
   }
 
   //Выводим всё на страницу
   Fill();
}
 
function Fill()
{
   //Очищаем контейнер
   particlesContainer.innerHTML = "";
 
   //Создаём новые элементы с обновлёнными свойствами и помещаем их в контейнер
   for(let i = 0; i < particles.length; i++)
   {
       let div = document.createElement("div");
       div.className = "particle";
 
       div.setAttribute("style", "top: " + particles[i].y + "px; left: " + particles[i].x + "px; z-index: " + particles[i].z + "px; filter: blur(" + particles[i].blur + "px); background: " + particles[i].color + "; ");
       particlesContainer.appendChild(div);
   }
}

$(document).on("ready", function () {
    $('.regular').slick({
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      });
});