import { FRESH_UK } from "./fresh.uk";
import type { OverlayDict } from "./index";

const ROLE_NOTE = "Кроки й гранати взято з джерела. Розподіл на п'ять ролей зробив STRATIFY, щоб тактику можна було вчити по гравцях.";
const NO_SHOT = "У джерелі немає скриншота — виставте лайнап у CS2 → Практика → Гід по гранатах, перш ніж на нього покладатися.";
const MAP_NOTE = "Радар: офіційний overview з файлів CS2 (© Valve). Маркери позицій розставлено вручну, вони приблизні.";

export const UK: OverlayDict = {
  ...FRESH_UK,
  // ───── Mirage
  "grenade:mir-ct-palace": { title: "Смок на CT", position: "Вертикальна лінія на стіні біля кута до Ramp", aim: "Трохи нижче кута вежі", purpose: "Закриває огляд із CT Spawn / Ticket для виходу на A.", instructions: ["Стань на вертикальну лінію біля кута до Ramp.", "Цілься трохи нижче кута вежі.", "Jump throw."] },
  "grenade:mir-stairs-tspawn": { title: "Смок на Stairs", position: "Кут першої сходинки одразу за T Spawn", aim: "Щілина в будівельних риштованнях", purpose: "Закриває Stairs на A. Без смоку на Jungle не кидай.", instructions: ["Стань на кут першої сходинки за T Spawn.", "Подивись угору на щілину в риштованнях.", "Кидок ЛКМ. Кидай у парі з Jungle."] },
  "grenade:mir-jungle-tspawn": { title: "Смок на Jungle", position: "Угору сходами за точкою Stairs, за рогом, біля позначки на стіні", aim: "Позначка після розвороту на 180°", purpose: "Закриває щілину Jungle / Connector під час виходу на A.", instructions: ["Піднімись сходами від точки Stairs і зайди за ріг.", "Стань біля позначки на стіні, розвернись на 180°.", "Цілься в позначку, кидок ЛКМ."] },
  "grenade:mir-topmid": { title: "Смок на Top Mid", position: "На смітнику в T Spawn", aim: "Антена", purpose: "Дає безпечно перейти Mid.", instructions: ["Застрибни на смітник у T Spawn.", "Цілься в антену.", "Кидок ЛКМ."] },
  "grenade:mir-window-tspawn": { title: "Смок у Window", position: "Ліворуч від смітника в T Spawn", aim: "Правий верхній кут дверей", purpose: "Закриває AWP у вікні, щоб зайняти Top Mid.", instructions: ["Стань ліворуч від смітника.", "Цілься в правий верхній кут дверей.", "Натисни D, потім jump throw."] },
  "grenade:mir-connector-tspawn": { title: "Смок на Top Connector", position: "Присівши, ліворуч від смітника в T Spawn", aim: "Іди навприсядки, доки приціл не дійде до кінчика балкона", purpose: "Відрізає Connector від Mid і A.", instructions: ["Присядь ліворуч від смітника й прицілься як на скріні.", "Іди вперед навприсядки, доки приціл не дійде до кінчика балкона.", "Jump throw."] },
  "grenade:mir-market-window": { title: "Смок у вікно Market", position: "Правий кут на виході з TV-кімнати (Apartments)", aim: "Угору на вежу", purpose: "Закриває вікно Market під час виходу на B.", instructions: ["Стань у правий кут на виході з TV-кімнати.", "Цілься вгору на вежу.", "Jump throw."] },
  "grenade:mir-market-door": { title: "Смок на двері Market", position: "Той самий кут, що й для вікна Market", aim: "Вікно на вежі", purpose: "Закриває двері Market (Kitchen) під час виходу на B.", instructions: ["Та сама точка, що й для смоку у вікно Market.", "Цілься у вікно на вежі.", "Jump throw."] },

  // ───── Inferno
  "grenade:inf-short": { title: "Смок на Short", position: "Між Mid, Second Mid і Apartments", aim: "Розвернись, подивись угору на антену", purpose: "Закриває Short під час заходу на A.", instructions: ["Стань там, де сходяться Mid, Second Mid і Apartments.", "Розвернись і подивись угору на антену.", "Кидок ЛКМ."] },
  "grenade:inf-long": { title: "Смок на A Long", position: "Кут у Second Mid", aim: "Трохи вище даху будівлі", purpose: "Закриває Long під час заходу на A.", instructions: ["Повернись у Second Mid, у кут.", "Цілься трохи вище даху будівлі.", "Jump throw."] },
  "grenade:inf-moto": { title: "Смок на Moto", position: "Позначка в Mid", aim: "Арка", purpose: "Ізолює Moto під час виходу на A.", instructions: ["Стань на позначку в Mid.", "Цілься в арку.", "Jump throw."] },
  "grenade:inf-arch": { title: "Смок на Arch", position: "Second Mid, біля Balcony", aim: "Над балконом", purpose: "Відрізає ротацію CT через Arch (обхід A через Long).", instructions: ["Стань у Second Mid біля Balcony.", "Подивись над балконом.", "Jump throw."] },
  "grenade:inf-library": { title: "Смок на Library", position: "Та сама точка, що й для Arch", aim: "Нижче, ніж для Arch", purpose: "Закриває Library під час обходу A.", instructions: ["Та сама точка, що й для смоку на Arch.", "Цілься нижче.", "Jump throw."] },
  "grenade:inf-ct-banana": { title: "Смок на CT", position: "Позначка на Banana", aim: "Трохи лівіше кута церкви", purpose: "Відрізає ротацію CT і буст під час виходу на B.", instructions: ["Стань на позначку на Banana.", "Подивись угору трохи лівіше кута церкви.", "Кидок ЛКМ. Заразом закриває буст."] },
  "grenade:inf-coffins-banana": { title: "Смок на Coffins", position: "Далі по Banana, на позначці", aim: "Над риштованнями, на смужку ламп", purpose: "Прибирає захисника на Coffins під час виходу на B.", instructions: ["Пройди далі по Banana до позначки.", "Цілься над риштованнями на смужку ламп.", "Кидок ЛКМ."] },

  // ───── Dust II
  "grenade:d2-ct-long": { title: "Смок на CT з Long", position: "З розбігу біля кута стіни A Long", aim: "Лівіше антени", purpose: "Дає гравцям з Long перейти на A без огляду CT.", instructions: ["Біжи до кута стіни A Long.", "Цілься лівіше антени.", "Jump throw з розбігу."] },
  "grenade:d2-ct-deep": { title: "Глибокий смок на CT", position: "Біля дверей A Long", aim: "X-подібні вікна, потім розвернутися й цілитися над краєм будівлі", purpose: "Альтернативний смок на CT для переходу на A.", instructions: ["Стань навпроти середини X-подібних вікон, трохи лівіше дверей Long.", "Розвернись і цілься вище краю будівлі.", "Звичайний кидок."] },
  "grenade:d2-ashort": { title: "Смок на A Short", position: "A Long, див. скриншот", aim: "Низ уступу", purpose: "Захищає від CT на Short, поки береш A.", instructions: ["Цілься в низ уступу.", "Звичайний кидок."] },
  "grenade:d2-xbox": { title: "Смок на Xbox", position: "T Spawn, у куті біля краю поручнів", aim: "Лівий кут будівлі попереду", purpose: "Позбавляє CT огляду на Catwalk і верхній Mid.", instructions: ["Застрибни на край поручнів у T Spawn, притиснись у кут.", "Цілься в лівий кут будівлі попереду.", "Jump throw."] },
  "grenade:d2-ctspawn-xbox": { title: "Смок на CT Spawn з Mid", position: "Впритул до Xbox", aim: "Маленька позначка на стіні Mid", purpose: "Закриває CT Spawn для проходу через Mid.", instructions: ["Стань впритул до Xbox.", "Цілься в маленьку позначку на стіні Mid.", "Звичайний кидок."] },
  "grenade:d2-bdoor": { title: "Смок на двері B", position: "Outside Tunnels, біля краю платформи", aim: "Трохи нижче тріщини", purpose: "Закриває двері B під час заходу на B.", instructions: ["Стань біля краю платформи в Outside Tunnels.", "Цілься трохи нижче тріщини.", "Jump throw."] },
  "grenade:d2-bwindow": { title: "Смок у вікно B", position: "Та сама точка, що й для дверей B", aim: "Нижче, ніж для дверей B", purpose: "Закриває вікно B під час заходу на B.", instructions: ["Та сама точка, що й для смоку на двері B.", "Опусти приціл нижче.", "Jump throw."] },
  "grenade:d2-bplatform": { title: "Смок на платформу B", position: "Біля стіни коло першої колони в B Tunnels", aim: "Небо, трохи нижче дерев'яної дошки", purpose: "Третій смок для заходу на B.", instructions: ["Стань біля стіни коло першої колони в B Tunnels.", "Цілься в небо трохи нижче дерев'яної дошки.", "Кидок."] },

  // ───── Ancient
  "grenade:anc-topmid": { title: "Смок на Mid", position: "З цього боку колони в T Spawn", aim: "Стіна ліворуч", purpose: "Відкриває Mid — ключ до Donut/A і Cave/B.", instructions: ["Стань з цього боку колони в T Spawn.", "Подивись на стіну ліворуч.", "Jump throw."] },
  "grenade:anc-a-ct": { title: "Смок на A CT", position: "Кут перед A Main", aim: "Кут над дверним прорізом A Main", purpose: "Закриває дальній кут CT (улюблена позиція AWP).", instructions: ["Стань у кут перед A Main.", "Подивись угору на кут над прорізом A Main.", "Jump throw."] },
  "grenade:anc-temple": { title: "Смок на Temple", position: "Той самий кут, що й для A CT", aim: "Позначка", purpose: "Закриває Temple під час виходу на A.", instructions: ["Після смоку на A CT залишайся в тому ж куті.", "Цілься в позначку.", "Кидок ЛКМ."] },
  "grenade:anc-donut": { title: "Смок на Donut з A Main", position: "Той самий кут, що й для A CT", aim: "Як на скріні", purpose: "Закриває Donut під час виходу на A.", instructions: ["Той самий кут перед A Main.", "Переведи приціл як на скріні.", "Jump throw."] },
  "grenade:anc-cave": { title: "Смок на Cave", position: "Кут перед дверима в Lane", aim: "Відвернись від кута, як на скріні", purpose: "Перший із трьох смоків на B з однієї точки.", instructions: ["Стань у кут перед дверима в Lane.", "Відвернись від кута, цілься як на скріні.", "Jump throw."] },
  "grenade:anc-bshort": { title: "Смок на B Short", position: "Кут перед дверима в Lane", aim: "Як на скріні", purpose: "B Short — часта позиція AWP.", instructions: ["Той самий кут, що й для Cave.", "Цілься як на скріні.", "Jump throw."] },
  "grenade:anc-blong": { title: "Смок на B Long", position: "Кут перед дверима в Lane", aim: "Позначка", purpose: "Третій смок на B — закриває Long.", instructions: ["Той самий кут, що й для Cave.", "Цілься в позначку.", "Jump throw."] },

  // ───── Anubis
  "grenade:anu-mid": { title: "Смок на Mid з T Spawn", position: "Двері в глибині T Spawn", aim: "Розвернись на 180°, стіна навпроти", purpose: "Легкий контроль мосту — перший крок до спліту на A чи до відтягування гравця з B.", instructions: ["Підійди до дверей у глибині T Spawn і стань по лінії.", "Розвернись на 180° і цілься в стіну навпроти.", "Jump throw."], note: "Після повернення Anubis у січні 2026 змінювали кліпінг — перевір один раз." },
  "grenade:anu-bconn": { title: "Смок на B Connector з T Spawn", position: "Стіна одразу за T Spawn (див. мінікарту на скріні)", aim: "Розвернись, як на скріні", purpose: "Дефолтний смок, що тримає CT у напрузі.", instructions: ["Вийди з T Spawn до стіни зі скріна.", "Розвернись і цілься як на скріні.", "Jump throw."] },
  "grenade:anu-heaven": { title: "Смок на Heaven", position: "Канал перед A Main", aim: "Частина даху зі скріна", purpose: "Перший смок виходу на A.", instructions: ["Підійди до каналу перед A Main і стань по лінії.", "Наведи приціл на частину даху зі скріна.", "Jump throw."] },
  "grenade:anu-plateau": { title: "Смок на Plateau", position: "Кут каналу перед A Main", aim: "Арка в стіні A Main", purpose: "Закриває Plateau під час виходу на A.", instructions: ["Стань у кут каналу перед A Main.", "Цілься в арку в стіні A Main.", "Кидок ЛКМ."] },
  "grenade:anu-connector": { title: "Смок на A Connector", position: "Перед A Main", aim: "Розвернись, точка зі скріна", purpose: "Не дає CT ротуватися через Connector.", instructions: ["Стань на точку перед A Main.", "Розвернись і цілься в точку зі скріна.", "Кидок ЛКМ."] },
  "grenade:anu-street": { title: "Смок на Street", position: "Стіна в B Main (B Long)", aim: "Розвернись на 180°, як на скріні", purpose: "Смок 1/3 для виходу на B.", instructions: ["Стань біля стіни в B Main.", "Розвернись на 180° і цілься як на скріні.", "Кидок ЛКМ. Усі три смоки на B може кинути один гравець."] },
  "grenade:anu-temple": { title: "Смок на Temple", position: "Та сама стіна в B Main", aim: "Як на скріні", purpose: "Смок 2/3 для виходу на B.", instructions: ["Та сама точка, що й для Street.", "Цілься як на скріні.", "Кидок ЛКМ."] },
  "grenade:anu-bconn-b": { title: "Смок на Connector з B Main", position: "Та сама стіна в B Main", aim: "Як на скріні", purpose: "Смок 3/3 для виходу на B.", instructions: ["Та сама точка, що й для Street.", "Цілься як на скріні.", "Кидок ЛКМ."] },

  // ───── Nuke
  "grenade:nuk-wall": { title: "Стіна смоків на Outside #1", position: "На вантажівці в T Spawn", aim: "Стіна", purpose: "Половина стіни на Outside — дає T перейти до Secret.", instructions: ["Стань на вантажівку в T Spawn.", "Цілься в стіну.", "Jump throw одночасно зі смоком #2."] },
  "grenade:nuk-wall-2": { title: "Стіна смоків на Outside #2", position: "Кут одразу за T Spawn", aim: "Синій контейнер", purpose: "Друга половина стіни на Outside.", instructions: ["Стань у кут одразу за T Spawn.", "Цілься в синій контейнер.", "Jump throw одночасно зі смоком #1."] },
  "grenade:nuk-garage": { title: "Смок на Garage", position: "Точка одразу за T Spawn", aim: "Частина силосу", purpose: "Дає просунутися до Mini для спліту на A.", instructions: ["Стань одразу за T Spawn.", "Наведи приціл на частину силосу зі скріна.", "Jump throw."] },
  "grenade:nuk-heaven": { title: "Смок на Heaven", position: "Паркани вздовж краю карти (орієнтир — синій бокс / мінікарта)", aim: "Розвернись, вікно", purpose: "Відрізає AWP з Heaven.", instructions: ["Стань біля парканів уздовж краю карти.", "Розвернись і цілься у вікно.", "Jump throw."] },
  "grenade:nuk-tred": { title: "Смок на T Red", position: "T Spawn", aim: "Трохи вище силосу", purpose: "Закриває T Red для переходу через Outside.", instructions: ["З T Spawn цілься трохи вище силосу.", "Jump throw — падає перед T Red."] },

  // ───── Cache
  "grenade:cac-connector": { title: "Смок на Connector", position: "T Spawn, по центру третьої смуги переходу справа", aim: "Під початок літери з джерела, тримати на бігу", purpose: "Закриває Connector на початку раунду.", instructions: ["Стань по центру третьої смуги переходу справа.", "Біжи, тримаючи приціл під літерою-орієнтиром.", "Кидок на бігу."], note: "Геометрію Cache у 2026 змінювали кілька разів — перевір." },
  "grenade:cac-highway": { title: "Смок на Highway", position: "A Main", aim: "Див. джерело", purpose: "Закриває Highway під час виходу на A.", instructions: ["Перший крок простого виходу на A."], note: NO_SHOT },
  "grenade:cac-forklift": { title: "Молотов на Forklift", position: "A Main", aim: "Див. джерело", purpose: "Випалює позицію Forklift.", instructions: ["Другий крок простого виходу на A, після смоку на Highway."], note: NO_SHOT },

  // ───── Tactics
  "tactic:mir-a-execute": {
    title: "Вихід на A: Ramp + Palace + Connector",
    summary: "Класичний захід на A на Mirage: ізолюй сайт смоками на CT, Jungle і Stairs, випали дальні кути, потім Palace і Ramp виходять разом після флешки.",
    roles: [["Смокер — CT", "Смок на CT з Palace, потім захід через Palace."], ["Смокер — Jungle", "Смок на Jungle з T Spawn, потім за Ramp."], ["Смокер — Stairs", "Смок на Stairs, потім трейд за тим, хто заходить з Ramp."], ["Entry — Ramp", "Молотов у дальній кут (Firebox або Sandwich), флешка і вихід з Ramp."], ["Connector / Mid", "Тиск на Connector з Mid, щоб зірвати ротацію."]],
    steps: [["Розстановка", "Ramp, Palace і гравець на Mid займають позиції."], ["Ізоляція сайту", "Смоки на CT, Jungle і Stairs ріжуть ротації."], ["Дальні кути", "Молотов у дальній кут, наприклад Firebox або Sandwich."], ["Вихід разом", "Флешка, потім Palace і Ramp виходять одночасно."], ["Плент і утримання", "Плент на дефолт і тримайте перехресні."]],
    utilityNotes: ["3 смоки (CT, Jungle, Stairs)", "1+ молотов у дальній кут", "Флешки перед виходом"],
    note: ROLE_NOTE,
  },
  "tactic:mir-fast-a": {
    title: "Швидкий вихід на A (без Mid)",
    summary: "Повністю пропускаєте Mid і одразу йдете на A зі смоками на CT, Stairs і Jungle та молотовом під балкон; один гравець лоркає Mid/Underpass як пізній варіант.",
    roles: [["Смокер — CT", "Миттєвий смок на CT."], ["Смокер — Stairs", "Миттєвий смок на Stairs."], ["Смокер — Jungle", "Миттєвий смок на Jungle."], ["Entry", "Молотов під балкон, потім захід на A."], ["Лоркер", "Mid / Underpass — пізній фланг на CT, які ротуються."]],
    steps: [["Одразу в атаку", "Усі (крім лоркера) одразу йдуть на A."], ["Гранати", "Миттєві смоки на CT, Stairs і Jungle; молотов під балкон."], ["Взяти сайт", "Заходьте на A разом. Лоркер карає CT, які стакаються або ротуються через Mid."]],
    utilityNotes: ["Найкраще проти CT, що стакають Mid"],
    note: "Прочитано за фрагментом гайду bo3.gg; повний текст — у джерелі. " + ROLE_NOTE,
  },
  "tactic:mir-b-execute": {
    title: "Вихід на B: Apartments + Short",
    summary: "Ізолюй B смоками у вікно Market і на двері Kitchen, випали Bench і Van, флешка через вихід з Apartments, а гравець на Short ріже ротацію CT з Mid.",
    roles: [["Смокер — вікно Market", "Смок у вікно Market."], ["Смокер — Kitchen", "Смок на двері Kitchen."], ["Молотови", "Молотови на Bench і Van."], ["Entry — Apartments", "Захід з Apartments за флешкою."], ["Short", "Тримає Short, ріже ротацію з Mid."]],
    steps: [["Позиції", "Четверо в Apartments, один на Mid у бік Short."], ["Ізоляція", "Смоки у вікно Market і на двері Kitchen."], ["Випалити близькі точки", "Молотови на Bench і Van."], ["Захід", "Флешка через вихід з Apartments і пуш; Short ріже ротацію."]],
    utilityNotes: ["2 смоки, 2 молотови, флешки"],
    note: ROLE_NOTE,
  },
  "tactic:mir-mid-default": {
    title: "Дефолт з контролем Mid",
    summary: "Смок у Window, забрати Top Mid, потім смок на Connector або Short, щоб відрізати шлях CT і загрожувати обом сайтам.",
    roles: [["Смок у Window", "Смок у Window з T Spawn."], ["Top Mid", "Забирає Top Mid під смоком у Window."], ["Смок на Connector/Short", "Ріже шлях CT."], ["Інфа з A", "Присутність на Ramp / Palace."], ["Інфа з B", "Присутність в Apartments."]],
    steps: [["Window", "Смок у Window, щоб закрити AWP на Mid."], ["Top Mid", "Забрати Top Mid."], ["Відрізати", "Смок на Connector або Short — тепер загрожуєте обом сайтам."]],
    note: ROLE_NOTE,
  },
  "tactic:inf-b-execute": {
    title: "Простий вихід на B (CT + Coffins)",
    summary: "Забрати Banana, смоки на CT і Coffins, молотов на New Box, флешка і захід разом, зачистити Dark і Oranges перед плентом.",
    roles: [["Смокер — CT", "Смок на CT з Banana."], ["Смокер — Coffins", "Смок на Coffins з Banana."], ["Молотов", "Молотов на New Box."], ["Флешер", "Флешка над сайтом."], ["Entry", "Заходить першим; чистить Dark і Oranges."]],
    steps: [["Контроль Banana", "Спершу забрати Banana."], ["Смоки", "Смок на CT, потім на Coffins."], ["Молотов", "Молотов на New Box або іншу відому близьку позицію."], ["Флешка і захід", "Флешка над сайтом і захід разом."], ["Зачистка і плент", "Зачистити Dark і Oranges; плентити лише коли ключові кути під контролем."]],
    utilityNotes: ["2 смоки, 1 молотов, флешки"],
    note: ROLE_NOTE,
  },
  "tactic:d2-long-take": {
    title: "Взяття A Long",
    summary: "Флешка на двері Long для таймінгу, забрати A Long, потім смок на CT/крос, щоб перейти на сайт. Молотов на Car викурює захисника Long.",
    roles: [["Флешер", "Флешка на двері Long."], ["Entry", "Забирає Long за флешкою."], ["Смок на CT", "Смок на CT з кута Long."], ["Молотов", "Молотов на Car."], ["Short / Mid", "Тиск на Mid/Short (смок на Xbox), щоб розтягнути захист."]],
    steps: [["Двері Long", "Флешка і забрати двері Long."], ["Зачистити Long", "Молотов на Car / Pit за ситуацією."], ["Перехід", "Смок на CT; перехід на сайт."]],
    note: "Зібрано з пріоритетних гранат за ExpCarry і смоку на CT за Dexerto. " + ROLE_NOTE,
  },
  "tactic:anu-a-execute": {
    title: "Простий вихід на A",
    summary: "Виграти Mid/Canal, смок на Heaven, ізолювати CT/Tunnel, випалити Fountain, флешка на A Main і одночасний удар через Connector.",
    roles: [["Mid / Canal", "Спершу забирає контроль Mid/Canal."], ["Смокер — Heaven", "Смок на Heaven з каналу перед A Main."], ["Смокер — CT/Tunnel", "Ізолює CT/Tunnel."], ["Молотов + флешка", "Молотов на Fountain, флешка на A Main."], ["Connector", "Виходить через Connector одночасно із заходом з A Main."]],
    steps: [["Mid / Canal", "Контроль Mid/Canal."], ["Heaven", "Смок на Heaven."], ["Ізоляція", "Ізолювати CT/Tunnel."], ["Fountain і флешка", "Молотов на Fountain, флешка на A Main."], ["Удар разом", "Connector іде одночасно з A Main."]],
    utilityNotes: ["Смок на Heaven + молотов", "Флешка на A", "Смок на CT/Tunnel"],
    note: ROLE_NOTE,
  },
  "tactic:nuk-outside-take": {
    title: "Взяття Outside (стіна смоків)",
    summary: "Outside виграють стіною смоків, а не дуелями: спершу стіна + смок на червоний контейнер, флешка, перехід парами, випалити близьку точку з боку Garage, потім спліт Secret і Ramp.",
    roles: [["Стіна — смок 1", "Смок на Outside з вантажівки."], ["Стіна — смок 2", "Другий смок стіни / смок на червоний контейнер."], ["Флешер", "Флешка через стіну."], ["Молотов", "Молотов на близьку позицію біля Garage."], ["Ramp", "Тиск на Ramp для спліту Secret/Ramp."]],
    steps: [["Спершу стіна", "Смоки на Outside і Red закривають огляд з Heaven і Garage. Без одного смоку перехід перетворюється на тир."], ["Флешка і перехід", "Флешка через стіну, перехід парами за смоками."], ["Зачистка і спліт", "Молотов на близьку позицію біля Garage, потім спліт Secret і Ramp."]],
    utilityNotes: ["Порядок: смок на Outside → смок на червоний контейнер → флешка на Outside → молотов на Outside"],
    note: ROLE_NOTE,
  },
  "tactic:nuk-upper-a": {
    title: "Захід на верхній A (3 гравці)",
    summary: "Смок на Yard прикриває шлях у Main, смок на Trophy закриває крос з Lobby; флешка на Rafters через Hut, молотов на Trophy, захід через Hut і Main одночасно.",
    roles: [["Смок на Yard", "Прикриває шлях у Main."], ["Смок на Trophy", "Закриває кут кросу з Lobby."], ["Флешка + молотов", "Флешка на Rafters через Hut, молотов на Trophy."], ["Entry через Hut", "Захід через Hut."], ["Entry через Main", "Захід через Main одночасно."]],
    steps: [["Смоки", "Смок на Yard і смок на Trophy."], ["Флешка і молотов", "Флешка на Rafters через Hut, молотов на Trophy."], ["Захід разом", "Hut і Main одночасно."]],
    utilityNotes: ["Лайнапів на Yard/Trophy в базі поки немає — додай їх із джерелом."],
    note: ROLE_NOTE,
  },
  "tactic:cac-a-execute": {
    title: "Простий вихід на A",
    summary: "Смок на Highway, молотов на Forklift, флешка на A Main — базовий захід на A для Premier.",
    roles: [["Смокер — Highway", "Смок на Highway."], ["Молотов — Forklift", "Молотов на Forklift."], ["Флешер", "Флешка на A Main, коли entry готовий виходити."], ["Entry", "Першим через A Main."], ["Mid", "Тримає тиск на Mid / Connector."]],
    steps: [["Highway", "Смок на Highway."], ["Forklift", "Молотов на Forklift."], ["Флешка і вихід", "Флешка на A Main, коли перші гравці готові виходити."]],
    note: "Джерело показує перші три кроки; геометрію Cache у 2026 змінювали. " + ROLE_NOTE,
  },

  // ───── Exercises
  "exercise:ex-aimbotz-150": { name: "Aim Botz — 150 хедшотів тапами", goal: "Стабільно ставити приціл у голову одиночними.", reps: "150 вбивств", instructions: ["Запусти Aim Botz.", "Увімкни «лише в голову», якщо хочеш суворіше.", "150 голів тапами; почни спочатку, якщо аім поплив."] },
  "exercise:ex-aimbotz-strafe-track": { name: "Aim Botz — ведення голови в стрейфі", goal: "Тримати приціл на голові в русі.", reps: "2 хв", instructions: ["Стрейфся вліво-вправо перед ботами.", "2 хвилини тримай приціл на рівні голови."] },
  "exercise:ex-aimbotz-ak100": { name: "Aim Botz — 100 вбивств з AK-47, лише в голову", goal: "Швидкий розігрів аіму перед матчем.", reps: "100 вбивств", instructions: ["Лише AK-47.", "Лише в голову.", "Набери 100 вбивств."] },
  "exercise:ex-aimbotz-50": { name: "Aim Botz — 50 голів тапами (легкий день)", goal: "Мінімальна розминка, коли граєш не всерйоз.", reps: "50 вбивств", instructions: ["50 голів тапами."] },
  "exercise:ex-recoil-ak-m4": { name: "Recoil Master — спреї AK і M4A4", goal: "Закріпити патерни віддачі гвинтівок.", reps: "5 + 5 спреїв", instructions: ["Обери AK-47, середня дистанція.", "5 повних спреїв.", "Перемкнись на M4A4, 5 повних спреїв."] },
  "exercise:ex-fastaim-50": { name: "Fast Aim/Reflex — 50 цілей", goal: "Швидкість реакції та фліки.", reps: "50 цілей", instructions: ["Лише гвинтівки.", "Влуч у 50 цілей, балансуючи швидкість і точність."] },
  "exercise:ex-prefire-angles": { name: "Префаєр у Yprac — 5–10 популярних кутів", goal: "Знати, де зазвичай стоять вороги, а не з'ясовувати це в рейтингу.", reps: "5–10 кутів", instructions: ["Одна карта за сесію.", "Пройди 5–10 популярних кутів.", "Для практики утримання використовуй режим захисту від ботів."] },
  "exercise:ex-counterstrafe-master": { name: "Контрстрейф", goal: "Повністю зупинятися перед кожним пострілом.", reps: "5 хв", instructions: ["Натисни протилежну клавішу, щоб зупинитися (D під час руху на A, A під час руху на D), потім стріляй.", "У Counter-strafe Master отримаєш заміри зупинки й часу до пострілу.", "В оновленні 23 вересня 2026 Valve додала індикатор контрстрейфу — використовуй його на тренуванні."] },
  "exercise:ex-counterstrafe-botstop": { name: "Піки кутів із замороженими ботами", goal: "Контрстрейф на реальних кутах карти.", reps: "5 хв", instructions: ["Офлайн-гра, `sv_cheats 1; bot_stop 1`, щоб заморозити ботів.", "Виглядай з-за кутів з контрстрейфом перед кожним пострілом."] },
  "exercise:ex-dm-focus": { name: "Deathmatch з одним фокусом", goal: "Застосовувати механіку під реальним тиском.", reps: "10 хв", instructions: ["Матчмейкінг → Deathmatch (або ком'юніті DM).", "Обери ОДИН фокус: постановка прицілу або контрстрейф перед кожним пострілом."] },
  "exercise:ex-dm-hs-goal": { name: "Deathmatch — ціль за відсотком хедшотів", goal: "Вимірювана ціль, наприклад 65% хедшотів.", reps: "1 матч", instructions: ["Постав конкретну ціль до заходу.", "Запиши результат у нотатки сесії."] },
  "exercise:ex-utility-yprac": { name: "Гранати — лайнапи в Yprac Hub", goal: "Вивчити в грі лайнапи зі своєї бази STRATIFY.", reps: "3× на лайнап", instructions: ["Відкрий режим гранат Yprac Hub на своїй карті.", "Кинь кожен лайнап зі свого списку 3 рази."], note: "Функцію карти підтверджено; «3× на лайнап» — порада STRATIFY." },
  "exercise:ex-utility-practice": { name: "Гранати — команди практики", goal: "Відпрацювати лайнапи на справжній карті з повтором кидка й превью траєкторії.", reps: "Усі лайнапи одного виходу", instructions: ["Створи гру для практики, відкрий консоль.", "sv_cheats 1; sv_infinite_ammo 1; ammo_grenade_limit_total 5; sv_grenade_trajectory_prac_pipreview 1; bot_kick; mp_restartgame 1", "bind \"x\" \"sv_rethrow_last_grenade\"; bind \"v\" \"noclip\"", "Кидай кожен лайнап, дивись через noclip, повторюй кидок, щоб побачити з боку захисту."] },
  "exercise:ex-defense-mode": { name: "Режим захисту / ретейків — позиціонування", goal: "Зрозуміти, де стояти, коли перепікувати і як не віддавати трейди.", reps: "15 хв", instructions: ["Грай на серверах префаєр-захисту / ретейків.", "Фокус на рішеннях про перепік, а не лише на вбивствах."] },
  "exercise:ex-demo-review": { name: "Розбір свого демо: лише смерті", goal: "Знайти повторювані помилки позиціонування.", reps: "1 демо", instructions: ["Відкрий демо останнього матчу.", "Перемотуй до кожної своєї смерті.", "Познач: приціл, позиція чи інфа?"], note: "Звичайна тренерська практика, але конкретного джерела поки немає — додай його в Джерелах." },
  "exercise:ex-monesy-prefire": { name: "Префаєр + DM (рутина m0NESY)", goal: "Рутина як у про: префаєр ботів на популярних позиціях, потім deathmatch.", reps: "1 карта + DM", instructions: ["Yprac / режим префаєру на карті: боти стоять на найпопулярніших позиціях.", "Заверши сесію deathmatch.", "За бажанням — Aim Botz."], note: "Описано його рутину часів CS:GO (Yprac Arena)." },

  // ───── Programs
  "program:pg-30": { name: "Розминка перед FACEIT", focus: "Розігрів аіму", description: "20-хвилинна рутина перед рейтингом від bo3.gg плюс короткий блок deathmatch із фокусом.", note: "Фінальний 10-хвилинний блок DM — за SteamAnalyst." },
  "program:pg-60": { name: "Сесія механіки", focus: "Аім + мувмент", description: "Розминка «для серйозної сесії» від ProSettings, потім контрстрейф і deathmatch з вимірюваною ціллю.", note: "Кожна вправа з джерелом; комбінація — від STRATIFY." },
  "program:pg-90": { name: "Механіка + гранати", focus: "Аім, префаєр, лайнапи", description: "Блок механіки, потім відпрацювання гранат на карті, яку будеш грати.", note: "Кожна вправа з джерелом; комбінація — від STRATIFY." },
  "program:pg-120": { name: "Повний тренувальний день", focus: "Усе + розбір", description: "Механіка, префаєр, гранати, позиціонування і розбір демо.", note: "Блок розбору демо не перевірено — див. його картку." },

  // ───── Playbook
  "playbook:pb-s1mple-market": { title: "Швидкий смок у вікно Market для рашу B", summary: "s1mple показав смок у вікно Market просто з T Spawn — найшвидший лайнап на це вікно на той момент, для підтримки рашу на B.", details: ["Кидається з кута T Spawn біля сходів в Apartments, приціл у верх будівлі.", "Навіщо: закрити огляд з вікна Market, щоб раш на B встиг до ротації CT.", "Опубліковано для CS:GO. У CS2 фізика смоків змінилася — перевір на сервері для практики."], note: "Епоха CS:GO." },
  "playbook:pb-monesy-routine": { title: "Тренувальна рутина m0NESY", summary: "Префаєр з ботами на найпопулярніших позиціях, наприкінці — deathmatch; іноді Aim Botz. Своїми картами він назвав Yprac Arena і aim_botz.", details: ["Префаєр по ботах на популярних позиціях.", "Кінець сесії — deathmatch.", "Іноді Aim Botz."], note: "Інтерв'ю до виходу CS2; на зміну Yprac Arena прийшов Yprac Hub." },
  "playbook:pb-biegan-cs": { title: "Контрстрейф: відпрацьовуй щодня", summary: "Порада Biegan: тренуй контрстрейф щодня, доки не стане автоматичним — спершу на тренувальних картах, потім у deathmatch.", details: ["Спершу тренувальні карти (без тиску).", "Потім deathmatch, щоб закріпити в реальних перестрілках."], note: "Цитата за CS2 Pulse." },

  // ───── Workshop
  "workshop:aimbotz": { description: "Нерухомі й рухомі боти, лише в голову, броня, дистанції. Стандартна карта для розминки." },
  "workshop:recoilmaster": { description: "Підказки спрею, сповільнення куль, нескінченні набої для гвинтівок і ПП." },
  "workshop:ypracHub": { description: "Режим префаєру з 64+ маршрутами й режим гранат з 1400+ лайнапами на картах Active Duty." },
  "workshop:fastaim": { description: "Спливаючі цілі для швидкості реакції та фліків." },
  "workshop:fastwarmup": { description: "Компактно все в одному: фліки, режим 50 вбивств на час, тренажер спрею, фліки з AWP." },
  "workshop:csmaster": { description: "Заміряє зупинку й час до пострілу, оцінює точність, боти в стрейфі." },

  // ───── Maps
  "map:mirage": {
    overview: "Трилінійна карта, побудована навколо контролю Mid. T зазвичай рано борються за Top Mid / Window, потім ідуть на A через Ramp + Palace або на B через Apartments + Short.",
    positions: [["m-p1", "Якір A (Ticket / CT)", "Якір", "Стежить за Ramp і Palace, повідомляє про ранні пуші. Описано в гайді bo3.gg по Mirage."], ["m-p2", "Jungle / Stairs", "Підтримка", "Грає перехресний з якорем A, може відійти в Connector."], ["m-p3", "Window / Sniper's Nest", "AWP", "Класична позиція AWP для ранніх фрагів на Mid."], ["m-p4", "Якір B", "Якір", "Тримає вихід з Apartments, часто з гранатами в Apartments."], ["m-p5", "Лорк на Top Mid", "Лоркер", "Тримає тиск на Mid, поки команда заходить на сайт."]],
    routes: [["m-r1", "Спліт A: Ramp + Palace + Connector", "Ramp і Palace виходять разом після смоків на CT, Jungle і Stairs (вихід на A за MetaBot)."], ["m-r2", "B через Apartments + Short", "Захід з Apartments, поки гравець на Short ріже ротацію з Mid (вихід на B за MetaBot)."], ["m-r3", "Контроль Mid", "Смок у Window, забрати Top Mid, потім Connector/Short — загроза обом сайтам."], ["m-r4", "Ротація CT B → A через Market", "Основний шлях ротації за CT."]],
    note: MAP_NOTE,
  },
  "map:inferno": {
    overview: "Тісна карта з великою кількістю гранат. Banana — ключовий бій за T для B; A атакують через Apartments, Mid і Short. CT рано й жорстко борються за Banana.",
    positions: [["i-p1", "Контроль Banana", "Гравець на Banana", "Рано бореться за Banana з гранатами (у Valve смоки на Banana і Banana Half-Wall — офіційні за CT)."], ["i-p2", "Coffins", "Якір B", "Глибока позиція на B, яку T смокають під час виходу."], ["i-p3", "Pit", "Якір A", "Глибока позиція на A, контролює виходи з Short і Apartments."], ["i-p4", "Arch / Library", "Ротатор", "Зв'язує A і CT; під час спліту на A її смокають."]],
    routes: [["i-r1", "Взяти Banana → B", "Спершу забрати Banana, потім смоки на CT + Coffins і захід (простий вихід на B за ExpCarry)."], ["i-r2", "A через Apartments + Mid", "Apartments/Balcony разом із тиском на Mid/Short; смоки на Arch, Library і Moto ізолюють сайт."], ["i-r3", "Ротація CT A → B через CT", "Основний шлях ротації — його й відрізає смок на CT."]],
    note: MAP_NOTE,
  },
  "map:dust2": {
    overview: "Довгі прострільні лінії й проста структура. T сплітять A через Long + Short (Catwalk) або заходять на B через Upper Tunnels. Смоки на Xbox і крос A — основа гранат за T.",
    positions: [["d-p1", "Long", "Гравець на Long", "Рано оспорює A Long; часто зі смоком на двері Long з CT Spawn."], ["d-p2", "Short / Cat", "Якір A", "Тримає Catwalk і допомагає Long."], ["d-p3", "Сайт B", "Якір B", "Тримає вихід з тунелів."], ["d-p4", "CT Mid / двері Mid", "Mid / ротатор", "Інфа про пуші на Mid, ротація на будь-який сайт."]],
    routes: [["d-r1", "Взяття A Long", "Флешка на двері Long для таймінгу, потім смок на крос A для переходу на сайт (PC Invasion / Dexerto)."], ["d-r2", "A Short через Xbox", "Смок на Xbox дає T перейти на Short, менше світячись для Mid і CT."], ["d-r3", "B через Upper Tunnels", "Смоки на двері / вікно B ізолюють сайт від ротацій CT."]],
    note: MAP_NOTE,
  },
  "map:ancient": {
    overview: "Храм у джунглях з акцентом на Mid. Donut і Mid зв'язують обидва сайти; основні входи — B Ramp і A Main.",
    positions: [["an-p1", "Donut", "Підтримка A", "Оспорює контроль Donut."], ["an-p2", "Сайт B", "Якір B", "Тримає B Ramp."]],
    routes: [["an-r1", "Захід по B Ramp", "Прямий захід на B; часто разом із тиском через Cave."], ["an-r2", "Спліт A Main + Donut", "Контроль Donut відкриває спліт з A Main."]],
    note: MAP_NOTE,
  },
  "map:anubis": {
    overview: "Карта від ком'юніті з водою на Mid. Контроль Connector і Canal вирішує ротації.",
    positions: [["anu-p1", "Connector", "Mid", "Тримає пуші через воду/Mid."]],
    routes: [["anu-r1", "Mid → Connector → A", "Контроль Mid для спліту A разом з A Main."]],
    note: MAP_NOTE,
  },
  "map:nuke": {
    overview: "Вертикальна карта з сайтами один над одним. Ключові бої — контроль Outside (Secret / Main) і Ramp; Heaven нависає над A.",
    positions: [["n-p1", "Heaven", "Якір A", "Висока позиція над сайтом A."]],
    routes: [["n-r1", "Ramp → B", "Взяття Ramp і захід на нижній B."]],
    note: MAP_NOTE,
  },
  "map:cache": {
    overview: "Повернулася в Active Duty в липні 2026 замість Overpass. Контроль Mid (Z / Connector) розділяє A Main і B.",
    positions: [["c-p1", "Сайт A", "Якір A", "Тримає A Main."]],
    routes: [["c-r1", "A Main", "Прямий захід через A Main."]],
    note: "Радар: офіційний overview з файлів CS2 (© Valve). Геометрію Cache у 2026 змінювали кілька разів — маркери приблизні.",
  },
  "map:overpass": {
    overview: "Вийшла з Active Duty 8 липня 2026 (замінена на Cache). Бої за Monster і Connector вирішують B; Long/Fountain ведуть на A.",
    routes: [["o-r1", "Monster → B", "Основний захід на B."]],
    note: MAP_NOTE,
  },
  "map:train": {
    overview: "Прибрана з Active Duty 22 січня 2026 (повернувся Anubis). Ivy і Main — на A; верхня/нижня зали — на B.",
    routes: [["t-r1", "Спліт Ivy + Main", "Тиск через Ivy з підтримкою з T Main."]],
    note: MAP_NOTE,
  },
};
