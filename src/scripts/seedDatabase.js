import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import { faker } from "@faker-js/faker";
import { getImageUrl } from "./imageUploadConfig.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB підключено успішно!");

    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Масив публічних ID аватарів, завантажених в Cloudinary
    const avatarPublicIds = [
      "avatar3_uu4a6b",
      "avatar2_ezptj8",
      "avatar4_qullp2",
      "avatar5_oq36el",
      "avatar1_ggxcrm",
    ];

    const customBios = [
      "Я люблю готувати і ділитися рецептами!",
      "Моя мета — створювати здорові і смачні страви.",
      "Фанат експериментів на кухні.",
      "Обожнюю готувати для родини і друзів.",
      "Хочу стати майстром кулінарії!",
    ];

    // Генрація користувачів
    const users = Array.from({ length: 5 }, (_, index) => ({
      _id: new ObjectId(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      avatar: getImageUrl(avatarPublicIds[index]), // Випадковий аватар
      bio: customBios[index],
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      followers: Math.floor(Math.random() * 80) + 1,
      following: Math.floor(Math.random() * 80) + 1,
      registeredAt: faker.date.past(),
    }));
    // Функція для отримання URL зображення
    /*function getImageUrl(avatarId) {
      return `https://res.cloudinary.com/dz1kvzidt/image/upload/c_fill,h_150,w_150/${avatarId}`;
    }*/
    //пофіксити авторів
    await User.insertMany(users); //додавання в базу даних
    console.log("Збережені користувачі:", users);
    console.log("ID першого користувача:", users[0]?._id);

    const recipes = [
      {
        title: "Буряковий борщ",
        image: "/uploads/popular_recipe1.jpg",
        description: "Смачний український борщ з м’ясом і овочами.",
        ingredients: [
          "2шт буряк",
          "5шт картопля",
          "1 морква",
          "1 цибуля",
          "1 куряче філе",
          "30г томатної пасти",
          "2.5л води",
          "зелень",
        ],
        steps: [
          "Підготуйте овочі: наріжте буряк, капусту, моркву, цибулю та картоплю. Буряк очистити, та відварити до напівготовності хвилин 30. Остудити та натерти на крупній тертці",
          "Філе порізати на шматочки, картоплю почистити і подрібнити. М'ясо з картоплею додати до каструлі де варився буряк, варити хвилин 15-20.",
          "Цибулю подрібнити. Буряк цибулю тушкувати на вершковому маслі, в кінці додати томат.",
          "Зтушкований буряк додати до кастрюлі, додати спеції за смаком, долити води.",
          "Готуйте до готовності овочів, додайте зелень при подачі за бажанням.",
        ],
        type: "Супи",
        cuisine: "Українська",
        diet: "Безглютенова",
        cookingTime: "від 30 хвилин до 1 години",
        difficulty: "Середньо",
        nutrition: {
          calories: 151,
          protein: 13.1,
          fats: 1.4,
          carbs: 21.5,
        },
        servings: 5,
        rating: 4,
        author: users[0]._id,
      },
      {
        title: "Плов",
        image: "/uploads/popular_recipe2.jpg",
        description: "Традиційний узбецький плов з рисом і м’ясом.",
        ingredients: [
          "500г рис довгозернистий",
          "500 г курка",
          "1шт морква",
          "1шт цибуля",
          "1шт часник",
          "куркума",
          "сіль перець",
        ],
        steps: [
          "Промийте рис кілька разів до прозорості води, залиште його у воді на 30 хвилин.",
          "Нарізання інгредієнтів. Моркву наріжте тонкою соломкою. Цибулю наріжте півкільцями. М’ясо наріжте середніми шматочками.",
          "У казані або глибокій сковороді розігрійте олію. Обсмажте м’ясо на сильному вогні до золотистої скоринки.",
          "Додайте цибулю, обсмажте до золотистого кольору. Потім додайте моркву та смажте 5-7 хвилин.",
          "Додайте спеції, добре перемішайте. Влийте воду, щоб вона покрила м’ясо та овочі. Зменшіть вогонь, накрийте кришкою та тушкуйте 20-30 хвилин.",
          "Злийте воду з рису, розкладіть його рівним шаром поверх овочів та м’яса. Вставте головку часнику посередині. Накрийте казан кришкою та готуйте на слабкому вогні 20 хвилин, доки рис не стане м’яким і вода не вбереться.",
          "Зніміть з вогню, залиште під кришкою на 10-15 хвилин. Перед подачею перемішайте.",
        ],
        type: "Основні страви",
        cuisine: "",
        diet: "Безглютенова",
        cookingTime: "від 1 години до 1 години 30 хвилин",
        difficulty: "Складно",
        nutrition: {
          calories: 480,
          protein: 27.2,
          fats: 8.6,
          carbs: 76.3,
        },
        servings: 5,
        rating: 4,
        author: users[1]._id,
      },
      {
        title: "Вареники з картоплею",
        image: "/uploads/popular_recipe3.jpg",
        description: "Смачні вареники з картоплею та підсмаженою цибулею.",
        ingredients: [
          "500г борошно",
          "1шт яйце",
          "3ст.л олія",
          "1 ч.л сіль",
          "6шт картопля",
          "2шт цибуля",
          "сметана",
        ],
        steps: [
          "Приготування тіста: у глибокій мисці змішайте яйце, сіль, теплу воду (200мл) та 1 ст.л. олії. Поступово додавайте борошно, замішуючи м’яке, еластичне тісто. Загорніть його в плівку і залиште відпочити на 20-30 хвилин.",
          "Почистіть картоплю, відваріть у підсоленій воді до готовності. Цибулю дрібно наріжте та обсмажте до золотистого кольору. Додайте цибулю в пюре, посоліть, поперчіть і перемішайте.",
          "Розкачайте тісто тонким шаром (2-3 мм) і виріжте круги (наприклад, за допомогою склянки). У центр кожного кола покладіть ложку начинки. Скріпіть краї, щільно защіпаючи, щоб вареники не розкрилися під час варіння.",
          "Закип’ятіть велику каструлю з підсоленою водою. Опустіть вареники невеликими партіями у воду, перемішайте, щоб не прилипали. Варіть 3-5 хвилин після спливання.",
          "Вареники можна подавати зі смаженою цибулею, сметаною або вершковим маслом.",
        ],
        type: "Обід",
        cuisine: "Українська",
        diet: "Веганська",
        cookingTime: "55 хвилин",
        difficulty: "Середньо",
        nutrition: {
          calories: 350,
          protein: 9.5,
          fats: 8.2,
          carbs: 60,
        },
        servings: 5,
        rating: 4,
        author: users[2]._id,
      },
      {
        title: "Олів’є",
        image: "/uploads/popular_recipe4.jpg",
        ingredients: [
          "3 шт картопля",
          "2 шт морква",
          "4 шт яйця",
          "300 г ковбаса",
          "3шт солоний огірок",
          "1банка горошок зелений",
          "150г майонез",
          "сіль перець",
        ],
        type: "Салати та закуски",
        rating: 4.6,
        cookingTime: "50 хвилин",
        portions: "6-8",
        description: "Класичний новорічний салат Олів’є.",
        difficulty: "Легко",
        cuisine: "Українська",
        nutrition: {
          calories: 280,
          protein: 12,
          fats: 20,
          carbs: 15,
        },
        servings: 7,
        rating: 3,
        instructions: [
          "Відваріть картоплю і моркву в мундирі до готовності. Остудіть, почистіть і наріжте маленькими кубиками.",
          "Яйця зваріть круто (8-10 хвилин), остудіть у холодній воді, почистіть та наріжте кубиками.",
          "Bарену ковбасу і солоні огірки наріжте такими ж кубиками, як і овочі.",
          "У великій мисці з’єднайте нарізані картоплю, моркву, яйця, ковбасу, огірки, зелений горошок (без рідини) та дрібно нарізану цибулю (за бажанням).",
          "Заправте салат майонезом, посоліть і поперчіть за смаком. Добре перемішайте.Поставте в холодильник на 1-2 години перед подачею, щоб смаки змішалися.",
        ],
        author: users[3]._id,
      },
      {
        title: "Салат Цезар",
        image: "/uploads/popular_recipe5.jpg",
        ingredients: [
          "300 г куряче філе",
          "1 пучок листя салату",
          "70 г сир пармезан",
          "1 зубчик часнику",
          "2ст.л. олія",
          "сіль та перець",
          "1 шт яйце",
          "1 ч.л. діжонська гірчиця",
          "1 ст.л. лимонний сік",
          "50 мл оливкова олія",
        ],
        type: "Салати та закуски",
        rating: 4.7,
        cookingTime: "40 хвилин",
        portions: "6-8",
        description: "Популярний салат з куркою, сиром і спеціальним соусом.",
        cuisine: "Італійська",
        difficulty: "Легко",
        nutrition: {
          calories: 320,
          protein: 28,
          fats: 22,
          carbs: 6,
        },
        servings: 7,
        rating: 5,
        instructions: [
          "Наріжте батон або багет кубиками. Змішайте їх з 1-2 ст.л. оливкової олії та дрібно нарізаним часником.Викладіть на деко і запікайте в духовці при 180°C 7-10 хвилин до золотистої скоринки.",
          "Філе змастіть сіллю, перцем і невеликою кількістю оливкової олії. Обсмажте на гриль-сковороді або звичайній сковороді до готовності (по 4-5 хвилин з кожного боку). Дайте охолонути і наріжте смужками.",
          "ДВимийте, просушіть і порвіть листя салату руками на великі шматки.",
          "Приготування заправки(можна використати готову заправу Цезар):Відваріть яйце 1 хвилину у киплячій воді (або використовуйте лише сирі жовтки). У чашу блендера покладіть яйце, лимонний сік, гірчицю, анчоуси, часник і вустерширський соус. Поступово вливаючи оливкову олію, збивайте до утворення кремової консистенції. Посоліть і поперчіть за смаком.",
          "У великій мисці змішайте листя салату, курку та половину сухариків. Додайте заправку та акуратно перемішайте. Викладіть на тарілку, посипте рештою сухариків і натертим пармезаном.",
        ],
        author: users[4]._id,
      },
      {
        title: "Піца Маргарита",
        image: "/uploads/popular_recipe6.jpg",
        ingredients: [
          "250 г борошно",
          "7 г сухі дріжді",
          "1 ч.л цукор",
          "3 ст.л. томатана паста",
          "1 зубчик часник",
          "3 шт. помідори",
          "200 г моцарела",
          "базилік",
          "оливкова олія",
        ],
        rating: 4.9,
        cookingTime: "40 хвилин",
        portions: "1",
        description: "Класична італійська піца з томатами і моцарелою.",
        difficulty: "Середньо",
        cuisine: "Італійська",
        type: "Вечеря",
        nutrition: {
          calories: 250,
          protein: 10,
          fats: 10,
          carbs: 30,
        },
        servings: 4,
        rating: 4,
        instructions: [
          "Приготування тіста. В теплій воді розчиніть цукор і сухі дріжджі. Дайте постояти 5-10 хвилин, поки дріжджі почнуть пінитися. Додайте сіль і оливкову олію, поступово додавайте борошно, замішуючи тісто. Замісіть еластичне тісто, накрийте його рушником і залиште на 1 годину в теплому місці для підйому.",
          "Приготування соусу. На сковороді розігрійте оливкову олію, додайте часник і обсмажте до аромату (1-2 хвилини). Додайте томатну пасту, сіль, перець і базилік. Перемішайте і варіть на слабкому вогні 5-7 хвилин. За бажанням, можна додати трохи води для отримання більш рідкої консистенції.",
          "Розігрійте духовку до 220°C. Після того, як тісто піднялося, розкачайте його на присипаній борошном поверхні до бажаного діаметра. Викладіть тісто на деко або пічну дошку, змащену оливковою олією.",
          "Рівномірно розподіліть томатний соус по тісту, залишаючи невеликий край. Наріжте моцарелу та помідори тонкими скибочками і викладіть на соус. Додайте кілька листочків свіжого базиліка.",
          "Печіть піцу в розігрітій духовці близько 10-12 хвилин, поки краї стануть золотистими, а сир розплавиться. Вийміть з духовки і, за бажанням, змастіть краєчки піци оливковою олією для блиску.",
          "Подавайте піцу гарячою, прикрасивши ще кількома листочками базиліка.",
        ],
        author: users[0]._id,
      },
      {
        title: "Томатний суп",
        image: "/uploads/popular_recipe8.jpg",
        cookingTime: "40 хвилин",
        portions: "4",
        ingredients: [
          "8 шт. помідори",
          "1 шт. цибуля",
          "2 зубчики часник",
          "1 шт. морква",
          "750 мл бульйон (овочевий або курячий)",
          "1 ст.л. томатна паста",
          "2 ст.л. оливкова олія",
          "сіль, перець",
          "1 ч.л. цукор",
          "1 ч.л. базилік",
          "крем або сметана для подачі",
        ],
        type: "Супи",
        rating: 4.2,
        description: "Легкий і корисний суп з томатів і базиліку.",
        difficulty: "Середньо",
        diet: ["Безглютенова", "Безлактозна", "Вегетеріанська"],
        cuisine: "Італійська",
        nutrition: {
          calories: 120,
          protein: 3,
          fats: 7,
          carbs: 15,
        },
        servings: 4,
        rating: 5,
        instructions: [
          "Якщо ви використовуєте свіжі помідори, зробіть на кожному хрестоподібний надріз, залийте їх кип'ятком на 1-2 хвилини, після чого зніміть шкіру та наріжте м'якоть. Цибулю наріжте дрібними кубиками, моркву — на тонкі кружечки або натріть на тертці, часник подрібніть.",
          "У великій каструлі або сковороді розігрійте оливкову олію. Додайте цибулю і часник, обсмажте на середньому вогні до прозорості (приблизно 5 хвилин). Додайте моркву і обсмажуйте ще 5 хвилин, щоб вона трохи пом'якшилась.",
          "Додайте нарізані помідори (або консервовані), томатну пасту, бульйон, сіль, перець, цукор (якщо використовуєте). Перемішайте, доведіть до кипіння, після чого зменшіть вогонь і тушкуйте 20-25 хвилин, поки овочі стануть м'якими. Якщо суп занадто густий, додайте ще бульйону або води.",
          "За допомогою блендера пюрируйте суп до однорідної консистенції. Якщо вам подобається більш текстурний суп, можна залишити кілька шматочків овочів.",
          "За потреби додайте ще сіль, перець, цукор або базилік за смаком. Подавайте гарячим, за бажанням додавши сметану або крем для більш ніжного смаку. Можна прикрасити свіжим базиліком.",
        ],
        author: users[1]._id,
      },
      {
        title: "Шашлик",
        image: "/uploads/popular_recipe9.jpg",
        cookingTime: " 4,5 годиин",
        portions: "6",
        ingredients: [
          "2 кг свинина",
          "4 шт. цибуля",
          "4 зубчики часник",
          "200 мл мінеральна вода ",
          "3 ст.л. олія",
          "4 ст.л. лимонний сік (або лимони)",
          "cіль",
          "чорний перець",
          "паприка",
          "зелень",
        ],
        type: "Основні страви",
        difficulty: "Легко",
        rating: 4.9,
        description: "Соковитий шашлик з маринованою свининою.",
        cuisine: "",
        diet: ["Безглютенова", "Безлактозна"],
        nutrition: {
          calories: 400,
          protein: 30,
          fats: 28,
          carbs: 3,
        },
        servings: 6,
        instructions: [
          "Наріжте м’ясо великими шматками (приблизно 3х3 см). Видаліть зайвий жир або плівки, якщо потрібно.",
          "Цибулю наріжте кільцями або півкільцями, часник подрібніть. У великій мисці змішайте м’ясо, цибулю, часник, лимонний сік, сіль, перець і спеції.Додайте олію, щоб спеції краще розподілилися. За бажанням влийте мінеральну воду, щоб м’ясо стало ще ніжнішим. Перемішайте все руками, добре втираючи маринад у м’ясо.",
          "Закрийте миску харчовою плівкою та поставте в холодильник мінімум на 3-4 години, краще на 8-12 годин.",
          "Замочіть дерев'яні шампури у воді на 30 хвилин, якщо використовуєте їх, щоб вони не згоріли. Розпаліть вугілля, дочекайтеся, поки воно стане гарячим, але без полум’я.",
          "Нанизуйте шматки м’яса на шампури, чергуючи їх із кільцями цибулі, якщо бажаєте. Викладайте шампури над вугіллям, періодично перевертаючи. Готуйте приблизно 15-20 хвилин, залежно від розміру шматків, поки м’ясо не стане рум’яним і добре просмаженим.",
          "Подавайте гарячим, прикрашеним свіжою зеленню. Добре поєднується з лавашем, свіжими овочами або соусами, такими як аджика або сацебелі.",
        ],
        servings: 5,
        rating: 5,
        author: users[2]._id,
      },
      {
        title: "Капусняк",
        image: "/uploads/popular_recipe10.jpg",
        cookingTime: " 2 годиин",
        portions: "4-6",
        ingredients: [
          "500 г свинина",
          "500 г квашена капуста",
          "4 шт. картопля",
          "1 шт. морква",
          "1 шт. цибуля",
          " лавровий лист",
          "сіль",
          "перець",
          "сметана для подачі",
        ],
        type: "Супи",
        rating: 4.5,
        description: "Традиційний український суп з капустою і салом.",
        diet: ["Безглютенова", "Безлактозна"],
        cuisine: "Українська",
        difficulty: "Середньо",
        nutrition: {
          calories: 220,
          protein: 18,
          fats: 14,
          carbs: 10,
        },
        instructions: [
          "Промийте м’ясо, наріжте великими шматками. Покладіть м’ясо в каструлю з 2,5-3 літрами води. Доведіть до кипіння, зніміть піну. Додайте лавровий лист, варіть на середньому вогні близько 1 години до готовності м’яса.",
          "Почистіть картоплю, наріжте кубиками. Додайте її в бульйон, варіть 10 хвилин.",
          "Цибулю наріжте дрібними кубиками, моркву натріть на тертці. На сковороді розігрійте олію, обсмажте цибулю та моркву до м’якості. Додайте томатну пасту (за бажанням) і тушкуйте ще 2-3 хвилини.",
          "Якщо капуста дуже кисла, промийте її під водою. Додайте капусту до супу разом із обсмаженими овочами. Варіть ще 15-20 хвилин, поки всі інгредієнти не стануть м’якими.",
          "Додайте сіль і перець за смаком. Якщо м’ясо було на кістці, зніміть його, наріжте і поверніть в суп.",
          "Розлийте гарячий капусняк по тарілках. Подавайте зі сметаною та свіжим хлібом.",
        ],
        servings: 5,
        rating: 3,
        author: users[3]._id,
      },
      {
        title: "Сирники",
        image: "/uploads/popular_recipe11.jpg",
        cookingTime: " 20 хвилин",
        ingredients: [
          "250 г сиру",
          "3 ст. л. борошна",
          "1 яйце",
          "сметана",
          "2 ст.л. цукру",
          "дрібку солі",
          "ванілін",
        ],
        type: "Десерти",
        rating: 4.8,
        description: "Пишні сирники з домашнього сиру.",
        difficulty: "Середньо",
        diet: "Вегетеріанська",
        cuisine: "Українська",
        nutrition: {
          calories: 180,
          protein: 8,
          fats: 9,
          carbs: 16,
        },
        servings: 4,
        rating: 4,
        instructions: [
          "У мисці змішайте сир, яйце, цукор, сіль і ванілін(за смаком).",
          "Додайте борошно та добре перемішайте до однорідної маси.",
          "Зліпіть з тіста невеликі круглі сирники, обваляйте їх у борошні.",
          "Розігрійте сковороду з невеликою кількістю олії.",
          "Обсмажуйте сирники на середньому вогні до золотистої скоринки з обох боків.",
          "Викладіть сирники на паперовий рушник, щоб прибрати зайвий жир.",
          "Подавайте теплими зі сметаною, медом або ягодами.",
        ],
        author: users[3]._id,
      },
      {
        title: "Смажені баклажани з часником і зеленню",
        image: "/uploads/popular_recipe12.jpg",
        ingredients: [
          "3 шт. баклажани",
          "3 зубчики часнику",
          "оливкова(соняшникова) олія",
          "cіль",
          "перець чорний мелений",
          "зелень",
        ],
        type: "Салати та закуски",
        cookingTime: "30 хвилин",
        rating: 4.3,
        description: "Смажені баклажани з часником і зеленню",
        diet: "Вегетеріанська",
        difficulty: "Легко",
        cuisine: "Середземноморська",
        nutrition: {
          calories: 150,
          protein: 3,
          fats: 12,
          carbs: 10,
        },
        servings: 3,
        rating: 4,
        instructions: [
          "Наріжте баклажани кружечками або смужками, посоліть і залиште на 15-20 хвилин, щоб позбутися гіркоти.",
          "Промийте баклажани водою та обсушіть паперовим рушником.",
          "Розігрійте сковороду з олією і обсмажте баклажани до золотистого кольору.",
          "Подрібніть часник і зелень, змішайте з невеликою кількістю олії.",
          "Викладіть обсмажені баклажани на тарілку, посипте часником і зеленню.",
          "Подавайте теплими або охолодженими як закуску або гарнір.",
        ],
        author: users[4]._id,
      },
      {
        title: "Різотто",
        image: "/uploads/popular_recipe13.jpg",
        ingredients: [
          "200 г рису арборіо",
          "200 г печерець",
          "1 шт. цибуля  ріпчаста",
          "1 зубчик часнику",
          "30 г вершкового масла",
          "2 ст. л. оливкова олія ",
          "100 мл білого сухого вина ",
          "500-600 мл курячого(овочевого) бульйону ",
          "50 мл вершків(20%) ",
          "50 г пармезану",
          "сіль",
          "чорний перець",
        ],
        type: "Основні страви",
        cookingTime: "30-40 хвилин",
        rating: 4.7,
        description: "Італійське різотто з вершковим смаком і грибами.",
        difficulty: "Середньо",
        diet: "Вегетеріанська",
        cuisine: "Італійська",
        nutrition: {
          calories: 380,
          protein: 10,
          fats: 18,
          carbs: 45,
        },
        servings: 2,
        rating: 5,
        instructions: [
          "Наріжте гриби тонкими скибочками, цибулю – дрібними кубиками, часник – подрібніть.",
          "У сковороді розігрійте 1 ст. л. оливкової олії, додайте гриби й обсмажуйте до випаровування рідини. Відкладіть гриби в тарілку.",
          "У тій самій сковороді розтопіть 20 г вершкового масла, додайте цибулю та обсмажте до м'якості. Додайте часник і готуйте ще 30 секунд.",
          "Засипте рис, перемішайте й обсмажуйте 1-2 хвилини, поки зерна не стануть злегка прозорими.",
          "Влийте біле вино та помішуйте, поки воно повністю не випарується.",
          "Поступово вливайте гарячий бульйон по 1 черпаку, постійно помішуючи, чекаючи, поки рідина вбереться, перед додаванням наступної порції.",
          "Коли рис майже готовий (через 15-18 хвилин), додайте обсмажені гриби.",
          "Додайте вершки, натертий пармезан, залишкове вершкове масло, перемішайте.",
          "Посоліть, поперчіть за смаком, прикрасьте свіжою зеленню та подавайте гарячим.",
        ],
        author: users[4]._id,
      },
      {
        title: "Млинці",
        image: "/uploads/popular_recipe14.jpg",
        ingredients: [
          "200 г борошна",
          "2 шт. яйця",
          "300 мл молока",
          "1 ст. л. рослинної олії",
          "1 ч. л. цукру",
          "сіль",
          "1 ст. л. вершкового масла",
        ],
        type: "Десерти",
        cookingTime: "20 хвилин",
        rating: 4.6,
        description: "Домашні млинці, які ідеально підходять для сніданку.",
        diet: "Вегетеріанська",
        cuisine: "Українська",
        difficulty: "Легко",
        nutrition: {
          calories: 220,
          protein: 6,
          fats: 12,
          carbs: 24,
        },
        servings: 4,
        rating: 5,
        instructions: [
          "У глибокій мисці змішайте борошно, цукор, сіль. Додайте яйця і поступово вливайте молоко, ретельно помішуючи, щоб не було грудок. Додайте рослинну олію і розтоплене вершкове масло. Перемішайте до однорідної консистенції.",
          "Розігрійте сковороду з антипригарним покриттям на середньому вогні, злегка змастивши її олією або маслом.",
          "Налийте невелику кількість тіста на сковороду і обертайте її, щоб тісто рівномірно розподілилося по всій поверхні. Печіть млинець до золотистої скоринки з обох боків. Повторюйте з рештою тіста.",
          "Готові млинці можна подавати з різними начинками (сир, м'ясо, ягоди, варення) або просто з медом чи сметаною.",
        ],
        author: users[0]._id,
      },
      {
        title: "Бісквітний торт",
        image: "/uploads/popular_recipe15.jpg",
        ingredients: [
          "200 г борошна",
          "200 г цукру",
          "4 шт. яйця",
          "100 мл молока",
          "100 г вершкового масла",
          "1 ч. л. розпушувача",
          "1 ч. л. ванільного цукру",
          "дрібка солі",
          "200 мл вершків (для крему)",
          "100 г цукрової пудри (для крему)",
          "50 г темного шоколаду (для глазурі)",
          "50 г вершкового масла (для глазурі)",
        ],
        type: "Десерти",
        cookingTime: "1 год 15 хв ",
        rating: 4.8,
        description: "Ніжний бісквітний торт з легкою текстурою.",
        diet: "Вегетеріанська",
        cuisine: "",
        difficulty: "Складно",
        nutrition: {
          calories: 400,
          protein: 6,
          fats: 20,
          carbs: 50,
        },
        servings: 8,
        rating: 5,
        instructions: [
          "Розігрійте духовку до 180°C. В окремій мисці збийте яйця з цукром до пишної маси. Розтопіть вершкове масло і молоко, додайте до збитих яєць, перемішайте. Просійте борошно разом із розпушувачем і ванільним цукром, додайте до яєчної суміші, обережно перемішуючи. Вилийте тісто у форму, застелену пергаментом, і випікайте 25-30 хвилин. Перевірте готовність зубочисткою.",
          "Збийте вершки з цукровою пудрою до м'якості. Якщо хочете більш стабільний крем, можна додати трохи маскарпоне або крем-сиру.",
          "Розтопіть шоколад і вершкове масло на водяній бані або в мікрохвильовці, перемішайте до однорідності.",
          "Готовий бісквіт охолодіть, розріжте на два або три коржі. Кожен корж змастіть кремом. Після того, як торт зібраний, покрийте його глазур'ю. Охолодіть в холодильнику перед подачею.",
        ],
        author: users[1]._id,
      },
    ];

    await Recipe.insertMany(recipes);
    console.log("Рецепти додані успішно!");

    // Виведення даних у консоль
    const allUsers = await User.find();
    console.log("==== Усі користувачі ====");
    console.log(allUsers);

    const allRecipes = await Recipe.find();
    console.log("==== Усі рецепти ====");
    console.log(allRecipes);

    console.log("Дані успішно додані до бази!");
  } catch (error) {
    console.error("Помилка при заповненні бази:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
