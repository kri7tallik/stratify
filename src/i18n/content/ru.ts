import { FRESH_RU } from "./fresh.ru";
import type { OverlayDict } from "./index";

const ROLE_NOTE = "Шаги и гранаты взяты из источника. Разбивку на пять ролей сделал STRATIFY, чтобы тактику можно было учить по игрокам.";
const NO_SHOT = "В источнике нет скриншота — выставь лайнап в CS2 → Практика → Гид по гранатам, прежде чем полагаться на него.";
const MAP_NOTE = "Радар: официальный overview из файлов CS2 (© Valve). Маркеры позиций расставлены вручную и приблизительны.";

export const RU: OverlayDict = {
  ...FRESH_RU,
  // ───── Mirage
  "grenade:mir-ct-palace": { title: "Смок на CT", position: "Вертикальная линия на стене у угла к Ramp", aim: "Чуть ниже угла башни", purpose: "Закрывает обзор с CT Spawn / Ticket для выхода на A.", instructions: ["Встань на вертикальную линию у угла к Ramp.", "Целься чуть ниже угла башни.", "Jump throw."] },
  "grenade:mir-stairs-tspawn": { title: "Смок на Stairs", position: "Угол первой ступеньки сразу за T Spawn", aim: "Щель в строительных лесах", purpose: "Закрывает Stairs на A. Без смока на Jungle не кидай.", instructions: ["Встань на угол первой ступеньки за T Spawn.", "Посмотри вверх на щель в лесах.", "Бросок ЛКМ. Кидай в паре с Jungle."] },
  "grenade:mir-jungle-tspawn": { title: "Смок на Jungle", position: "Вверх по ступенькам за точкой Stairs, за углом, у отметки на стене", aim: "Отметка после разворота на 180°", purpose: "Закрывает щель Jungle / Connector при выходе на A.", instructions: ["Поднимись по ступенькам от точки Stairs и зайди за угол.", "Встань у отметки на стене, развернись на 180°.", "Целься в отметку, бросок ЛКМ."] },
  "grenade:mir-topmid": { title: "Смок на Top Mid", position: "На мусорном баке в T Spawn", aim: "Антенна", purpose: "Позволяет безопасно перейти Mid.", instructions: ["Запрыгни на бак в T Spawn.", "Целься в антенну.", "Бросок ЛКМ."] },
  "grenade:mir-window-tspawn": { title: "Смок в Window", position: "Слева от бака в T Spawn", aim: "Правый верхний угол двери", purpose: "Закрывает AWP в окне, чтобы занять Top Mid.", instructions: ["Встань слева от бака.", "Целься в правый верхний угол двери.", "Нажми D, затем jump throw."] },
  "grenade:mir-connector-tspawn": { title: "Смок на Top Connector", position: "Присев, слева от бака в T Spawn", aim: "Иди на корточках, пока прицел не дойдёт до кончика балкона", purpose: "Отрезает Connector от Mid и A.", instructions: ["Присядь слева от бака и прицелься как на скрине.", "Иди вперёд на корточках, пока прицел не дойдёт до кончика балкона.", "Jump throw."] },
  "grenade:mir-market-window": { title: "Смок в окно Market", position: "Правый угол на выходе из TV-комнаты (Apartments)", aim: "Вверх на башню", purpose: "Закрывает окно Market при выходе на B.", instructions: ["Встань в правый угол на выходе из TV-комнаты.", "Целься вверх на башню.", "Jump throw."] },
  "grenade:mir-market-door": { title: "Смок на дверь Market", position: "Тот же угол, что и для окна Market", aim: "Окно на башне", purpose: "Закрывает дверь Market (Kitchen) при выходе на B.", instructions: ["Та же точка, что и для смока в окно Market.", "Целься в окно на башне.", "Jump throw."] },

  // ───── Inferno
  "grenade:inf-short": { title: "Смок на Short", position: "Между Mid, Second Mid и Apartments", aim: "Развернись, посмотри вверх на антенну", purpose: "Закрывает Short при заходе на A.", instructions: ["Встань там, где сходятся Mid, Second Mid и Apartments.", "Развернись и посмотри вверх на антенну.", "Бросок ЛКМ."] },
  "grenade:inf-long": { title: "Смок на A Long", position: "Угол в Second Mid", aim: "Чуть выше крыши здания", purpose: "Закрывает Long при заходе на A.", instructions: ["Вернись в Second Mid, в угол.", "Целься чуть выше крыши здания.", "Jump throw."] },
  "grenade:inf-moto": { title: "Смок на Moto", position: "Отметка в Mid", aim: "Арка", purpose: "Изолирует Moto при выходе на A.", instructions: ["Встань на отметку в Mid.", "Целься в арку.", "Jump throw."] },
  "grenade:inf-arch": { title: "Смок на Arch", position: "Second Mid, у Balcony", aim: "Над балконом", purpose: "Отрезает ротацию CT через Arch (обход A через Long).", instructions: ["Встань в Second Mid у Balcony.", "Посмотри над балконом.", "Jump throw."] },
  "grenade:inf-library": { title: "Смок на Library", position: "Та же точка, что и для Arch", aim: "Ниже, чем для Arch", purpose: "Закрывает Library при обходе A.", instructions: ["Та же точка, что и для смока на Arch.", "Целься ниже.", "Jump throw."] },
  "grenade:inf-ct-banana": { title: "Смок на CT", position: "Отметка на Banana", aim: "Чуть левее угла церкви", purpose: "Отрезает ротацию CT и буст при выходе на B.", instructions: ["Встань на отметку на Banana.", "Посмотри вверх чуть левее угла церкви.", "Бросок ЛКМ. Заодно закрывает буст."] },
  "grenade:inf-coffins-banana": { title: "Смок на Coffins", position: "Дальше по Banana, на отметке", aim: "Над лесами, на полоску ламп", purpose: "Убирает защитника на Coffins при выходе на B.", instructions: ["Пройди дальше по Banana до отметки.", "Целься над лесами на полоску ламп.", "Бросок ЛКМ."] },

  // ───── Dust II
  "grenade:d2-ct-long": { title: "Смок на CT с Long", position: "С разбега у угла стены A Long", aim: "Левее антенны", purpose: "Даёт игрокам с Long перейти на A без обзора CT.", instructions: ["Беги к углу стены A Long.", "Целься левее антенны.", "Jump throw с разбега."] },
  "grenade:d2-ct-deep": { title: "Глубокий смок на CT", position: "Рядом с дверями A Long", aim: "X-образные окна, потом развернуться и целиться над краем здания", purpose: "Альтернативный смок на CT для перехода на A.", instructions: ["Встань напротив середины X-образных окон, чуть левее дверей Long.", "Развернись и целься выше края здания.", "Обычный бросок."] },
  "grenade:d2-ashort": { title: "Смок на A Short", position: "A Long, см. скриншот", aim: "Низ уступа", purpose: "Защищает от CT на Short, пока берёшь A.", instructions: ["Целься в низ уступа.", "Обычный бросок."] },
  "grenade:d2-xbox": { title: "Смок на Xbox", position: "T Spawn, в углу у края перил", aim: "Левый угол здания впереди", purpose: "Лишает CT обзора на Catwalk и верхний Mid.", instructions: ["Запрыгни на край перил в T Spawn, прижмись в угол.", "Целься в левый угол здания впереди.", "Jump throw."] },
  "grenade:d2-ctspawn-xbox": { title: "Смок на CT Spawn с Mid", position: "Вплотную к Xbox", aim: "Маленькая отметка на стене Mid", purpose: "Закрывает CT Spawn для прохода через Mid.", instructions: ["Встань вплотную к Xbox.", "Целься в маленькую отметку на стене Mid.", "Обычный бросок."] },
  "grenade:d2-bdoor": { title: "Смок на двери B", position: "Outside Tunnels, у края платформы", aim: "Чуть ниже трещины", purpose: "Закрывает двери B при заходе на B.", instructions: ["Встань у края платформы в Outside Tunnels.", "Целься чуть ниже трещины.", "Jump throw."] },
  "grenade:d2-bwindow": { title: "Смок в окно B", position: "Та же точка, что и для дверей B", aim: "Ниже, чем для дверей B", purpose: "Закрывает окно B при заходе на B.", instructions: ["Та же точка, что и для смока на двери B.", "Опусти прицел ниже.", "Jump throw."] },
  "grenade:d2-bplatform": { title: "Смок на платформу B", position: "У стены возле первой колонны в B Tunnels", aim: "Небо, чуть ниже деревянной доски", purpose: "Третий смок для захода на B.", instructions: ["Встань у стены возле первой колонны в B Tunnels.", "Целься в небо чуть ниже деревянной доски.", "Бросок."] },

  // ───── Ancient
  "grenade:anc-topmid": { title: "Смок на Mid", position: "С этой стороны колонны в T Spawn", aim: "Стена слева", purpose: "Открывает Mid — ключ к Donut/A и Cave/B.", instructions: ["Встань с этой стороны колонны в T Spawn.", "Посмотри на стену слева.", "Jump throw."] },
  "grenade:anc-a-ct": { title: "Смок на A CT", position: "Угол перед A Main", aim: "Угол над дверным проёмом A Main", purpose: "Закрывает дальний угол CT (любимая позиция AWP).", instructions: ["Встань в угол перед A Main.", "Посмотри вверх на угол над проёмом A Main.", "Jump throw."] },
  "grenade:anc-temple": { title: "Смок на Temple", position: "Тот же угол, что и для A CT", aim: "Отметка", purpose: "Закрывает Temple при выходе на A.", instructions: ["После смока на A CT останься в том же углу.", "Целься в отметку.", "Бросок ЛКМ."] },
  "grenade:anc-donut": { title: "Смок на Donut с A Main", position: "Тот же угол, что и для A CT", aim: "Как на скрине", purpose: "Закрывает Donut при выходе на A.", instructions: ["Тот же угол перед A Main.", "Переведи прицел как на скрине.", "Jump throw."] },
  "grenade:anc-cave": { title: "Смок на Cave", position: "Угол перед дверями в Lane", aim: "Отвернись от угла, как на скрине", purpose: "Первый из трёх смоков на B с одной точки.", instructions: ["Встань в угол перед дверями в Lane.", "Отвернись от угла, целься как на скрине.", "Jump throw."] },
  "grenade:anc-bshort": { title: "Смок на B Short", position: "Угол перед дверями в Lane", aim: "Как на скрине", purpose: "B Short — частая позиция AWP.", instructions: ["Тот же угол, что и для Cave.", "Целься как на скрине.", "Jump throw."] },
  "grenade:anc-blong": { title: "Смок на B Long", position: "Угол перед дверями в Lane", aim: "Отметка", purpose: "Третий смок на B — закрывает Long.", instructions: ["Тот же угол, что и для Cave.", "Целься в отметку.", "Jump throw."] },

  // ───── Anubis
  "grenade:anu-mid": { title: "Смок на Mid с T Spawn", position: "Дверь в глубине T Spawn", aim: "Развернись на 180°, стена напротив", purpose: "Лёгкий контроль моста — первый шаг к сплиту на A или к оттяжке игрока с B.", instructions: ["Подойди к двери в глубине T Spawn и встань по линии.", "Развернись на 180° и целься в стену напротив.", "Jump throw."], note: "После возвращения Anubis в январе 2026 меняли клиппинг — перепроверь один раз." },
  "grenade:anu-bconn": { title: "Смок на B Connector с T Spawn", position: "Стена сразу за T Spawn (см. миникарту на скрине)", aim: "Развернись, как на скрине", purpose: "Дефолтный смок, который держит CT в напряжении.", instructions: ["Выйди из T Spawn к стене со скрина.", "Развернись и целься как на скрине.", "Jump throw."] },
  "grenade:anu-heaven": { title: "Смок на Heaven", position: "Канал перед A Main", aim: "Часть крыши со скрина", purpose: "Первый смок выхода на A.", instructions: ["Подойди к каналу перед A Main и встань по линии.", "Совмести прицел с частью крыши со скрина.", "Jump throw."] },
  "grenade:anu-plateau": { title: "Смок на Plateau", position: "Угол канала перед A Main", aim: "Арка в стене A Main", purpose: "Закрывает Plateau при выходе на A.", instructions: ["Встань в угол канала перед A Main.", "Целься в арку в стене A Main.", "Бросок ЛКМ."] },
  "grenade:anu-connector": { title: "Смок на A Connector", position: "Перед A Main", aim: "Развернись, точка со скрина", purpose: "Не даёт CT ротироваться через Connector.", instructions: ["Встань на точку перед A Main.", "Развернись и целься в точку со скрина.", "Бросок ЛКМ."] },
  "grenade:anu-street": { title: "Смок на Street", position: "Стена в B Main (B Long)", aim: "Развернись на 180°, как на скрине", purpose: "Смок 1/3 для выхода на B.", instructions: ["Встань у стены в B Main.", "Развернись на 180° и целься как на скрине.", "Бросок ЛКМ. Все три смока на B может кинуть один игрок."] },
  "grenade:anu-temple": { title: "Смок на Temple", position: "Та же стена в B Main", aim: "Как на скрине", purpose: "Смок 2/3 для выхода на B.", instructions: ["Та же точка, что и для Street.", "Целься как на скрине.", "Бросок ЛКМ."] },
  "grenade:anu-bconn-b": { title: "Смок на Connector с B Main", position: "Та же стена в B Main", aim: "Как на скрине", purpose: "Смок 3/3 для выхода на B.", instructions: ["Та же точка, что и для Street.", "Целься как на скрине.", "Бросок ЛКМ."] },

  // ───── Nuke
  "grenade:nuk-wall": { title: "Стена смоков на Outside #1", position: "На грузовике в T Spawn", aim: "Стена", purpose: "Половина стены на Outside — даёт T перейти к Secret.", instructions: ["Встань на грузовик в T Spawn.", "Целься в стену.", "Jump throw одновременно со смоком #2."] },
  "grenade:nuk-wall-2": { title: "Стена смоков на Outside #2", position: "Угол сразу за T Spawn", aim: "Синий контейнер", purpose: "Вторая половина стены на Outside.", instructions: ["Встань в угол сразу за T Spawn.", "Целься в синий контейнер.", "Jump throw одновременно со смоком #1."] },
  "grenade:nuk-garage": { title: "Смок на Garage", position: "Точка сразу за T Spawn", aim: "Часть силоса", purpose: "Позволяет продвинуться к Mini для сплита на A.", instructions: ["Встань сразу за T Spawn.", "Совмести прицел с частью силоса со скрина.", "Jump throw."] },
  "grenade:nuk-heaven": { title: "Смок на Heaven", position: "Заборы у края карты (ориентир — синий бокс / миникарта)", aim: "Развернись, окно", purpose: "Отрезает AWP с Heaven.", instructions: ["Встань у заборов вдоль края карты.", "Развернись и целься в окно.", "Jump throw."] },
  "grenade:nuk-tred": { title: "Смок на T Red", position: "T Spawn", aim: "Чуть выше силоса", purpose: "Закрывает T Red для перехода через Outside.", instructions: ["Из T Spawn целься чуть выше силоса.", "Jump throw — падает перед T Red."] },

  // ───── Cache
  "grenade:cac-connector": { title: "Смок на Connector", position: "T Spawn, по центру третьей полосы перехода справа", aim: "Под начало буквы из источника, держать на бегу", purpose: "Закрывает Connector в начале раунда.", instructions: ["Встань по центру третьей полосы перехода справа.", "Беги, держа прицел под буквой-ориентиром.", "Бросок на бегу."], note: "Геометрию Cache в 2026 меняли несколько раз — перепроверь." },
  "grenade:cac-highway": { title: "Смок на Highway", position: "A Main", aim: "См. источник", purpose: "Закрывает Highway при выходе на A.", instructions: ["Первый шаг простого выхода на A."], note: NO_SHOT },
  "grenade:cac-forklift": { title: "Молотов на Forklift", position: "A Main", aim: "См. источник", purpose: "Выжигает позицию Forklift.", instructions: ["Второй шаг простого выхода на A, после смока на Highway."], note: NO_SHOT },

  // ───── Tactics
  "tactic:mir-a-execute": {
    title: "Выход на A: Ramp + Palace + Connector",
    summary: "Классический заход на A на Mirage: изолируй сайт смоками на CT, Jungle и Stairs, выжги дальние углы, затем Palace и Ramp выходят вместе после флешки.",
    roles: [["Смокер — CT", "Смок на CT из Palace, потом заход через Palace."], ["Смокер — Jungle", "Смок на Jungle из T Spawn, потом за Ramp."], ["Смокер — Stairs", "Смок на Stairs, потом трейд за заходящим с Ramp."], ["Entry — Ramp", "Молотов в дальний угол (Firebox или Sandwich), флешка и выход с Ramp."], ["Connector / Mid", "Давление на Connector с Mid, чтобы сорвать ротацию."]],
    steps: [["Расстановка", "Ramp, Palace и игрок на Mid занимают позиции."], ["Изоляция сайта", "Смоки на CT, Jungle и Stairs режут ротации."], ["Дальние углы", "Молотов в дальний угол, например Firebox или Sandwich."], ["Выход вместе", "Флешка, затем Palace и Ramp выходят одновременно."], ["Плент и удержание", "Плент на дефолт и держите перекрёстные."]],
    utilityNotes: ["3 смока (CT, Jungle, Stairs)", "1+ молотов в дальний угол", "Флешки перед выходом"],
    note: ROLE_NOTE,
  },
  "tactic:mir-fast-a": {
    title: "Быстрый выход на A (без Mid)",
    summary: "Полностью пропускаете Mid и сразу идёте на A со смоками на CT, Stairs и Jungle и молотовом под балкон; один игрок лёркает Mid/Underpass как поздний вариант.",
    roles: [["Смокер — CT", "Мгновенный смок на CT."], ["Смокер — Stairs", "Мгновенный смок на Stairs."], ["Смокер — Jungle", "Мгновенный смок на Jungle."], ["Entry", "Молотов под балкон, затем заход на A."], ["Лёркер", "Mid / Underpass — поздний фланг на ротирующихся CT."]],
    steps: [["Сразу в атаку", "Все (кроме лёркера) сразу идут на A."], ["Гранаты", "Мгновенные смоки на CT, Stairs и Jungle; молотов под балкон."], ["Взять сайт", "Заходите на A вместе. Лёркер наказывает CT, которые стакаются или ротируются через Mid."]],
    utilityNotes: ["Лучше всего против CT, стакающих Mid"],
    note: "Прочитано по фрагменту гайда bo3.gg; полный текст — в источнике. " + ROLE_NOTE,
  },
  "tactic:mir-b-execute": {
    title: "Выход на B: Apartments + Short",
    summary: "Изолируй B смоками в окно Market и на дверь Kitchen, выжги Bench и Van, флешка через выход из Apartments, а игрок на Short режет ротацию CT с Mid.",
    roles: [["Смокер — окно Market", "Смок в окно Market."], ["Смокер — Kitchen", "Смок на дверь Kitchen."], ["Молотовы", "Молотовы на Bench и Van."], ["Entry — Apartments", "Заход из Apartments за флешкой."], ["Short", "Держит Short, режет ротацию с Mid."]],
    steps: [["Позиции", "Четверо в Apartments, один на Mid в сторону Short."], ["Изоляция", "Смоки в окно Market и на дверь Kitchen."], ["Выжечь близкие точки", "Молотовы на Bench и Van."], ["Заход", "Флешка через выход из Apartments и пуш; Short режет ротацию."]],
    utilityNotes: ["2 смока, 2 молотова, флешки"],
    note: ROLE_NOTE,
  },
  "tactic:mir-mid-default": {
    title: "Дефолт с контролем Mid",
    summary: "Смок в Window, забрать Top Mid, затем смок на Connector или Short, чтобы отрезать путь CT и угрожать обоим сайтам.",
    roles: [["Смок в Window", "Смок в Window из T Spawn."], ["Top Mid", "Забирает Top Mid под смоком в Window."], ["Смок на Connector/Short", "Режет путь CT."], ["Инфа с A", "Присутствие на Ramp / Palace."], ["Инфа с B", "Присутствие в Apartments."]],
    steps: [["Window", "Смок в Window, чтобы закрыть AWP на Mid."], ["Top Mid", "Забрать Top Mid."], ["Отрезать", "Смок на Connector или Short — теперь угрожаете обоим сайтам."]],
    note: ROLE_NOTE,
  },
  "tactic:inf-b-execute": {
    title: "Простой выход на B (CT + Coffins)",
    summary: "Забрать Banana, смоки на CT и Coffins, молотов на New Box, флешка и заход вместе, зачистить Dark и Oranges перед плентом.",
    roles: [["Смокер — CT", "Смок на CT с Banana."], ["Смокер — Coffins", "Смок на Coffins с Banana."], ["Молотов", "Молотов на New Box."], ["Флешер", "Флешка над сайтом."], ["Entry", "Заходит первым; чистит Dark и Oranges."]],
    steps: [["Контроль Banana", "Сначала забрать Banana."], ["Смоки", "Смок на CT, затем на Coffins."], ["Молотов", "Молотов на New Box или другую известную близкую позицию."], ["Флешка и заход", "Флешка над сайтом и заход вместе."], ["Зачистка и плент", "Зачистить Dark и Oranges; плентить только когда ключевые углы под контролем."]],
    utilityNotes: ["2 смока, 1 молотов, флешки"],
    note: ROLE_NOTE,
  },
  "tactic:d2-long-take": {
    title: "Взятие A Long",
    summary: "Флешка на двери Long для тайминга, забрать A Long, затем смок на CT/кросс, чтобы перейти на сайт. Молотов на Car выкуривает защитника Long.",
    roles: [["Флешер", "Флешка на двери Long."], ["Entry", "Забирает Long за флешкой."], ["Смок на CT", "Смок на CT с угла Long."], ["Молотов", "Молотов на Car."], ["Short / Mid", "Давление на Mid/Short (смок на Xbox), чтобы растянуть защиту."]],
    steps: [["Двери Long", "Флешка и забрать двери Long."], ["Зачистить Long", "Молотов на Car / Pit по ситуации."], ["Переход", "Смок на CT; переход на сайт."]],
    note: "Собрано из приоритетных гранат по ExpCarry и смока на CT по Dexerto. " + ROLE_NOTE,
  },
  "tactic:anu-a-execute": {
    title: "Простой выход на A",
    summary: "Выиграть Mid/Canal, смок на Heaven, изолировать CT/Tunnel, выжечь Fountain, флешка на A Main и одновременный удар через Connector.",
    roles: [["Mid / Canal", "Сначала забирает контроль Mid/Canal."], ["Смокер — Heaven", "Смок на Heaven из канала перед A Main."], ["Смокер — CT/Tunnel", "Изолирует CT/Tunnel."], ["Молотов + флешка", "Молотов на Fountain, флешка на A Main."], ["Connector", "Выходит через Connector одновременно с заходом с A Main."]],
    steps: [["Mid / Canal", "Контроль Mid/Canal."], ["Heaven", "Смок на Heaven."], ["Изоляция", "Изолировать CT/Tunnel."], ["Fountain и флешка", "Молотов на Fountain, флешка на A Main."], ["Удар вместе", "Connector идёт одновременно с A Main."]],
    utilityNotes: ["Смок на Heaven + молотов", "Флешка на A", "Смок на CT/Tunnel"],
    note: ROLE_NOTE,
  },
  "tactic:nuk-outside-take": {
    title: "Взятие Outside (стена смоков)",
    summary: "Outside выигрывается стеной смоков, а не дуэлями: сначала стена + смок на красный контейнер, флешка, переход парами, выжечь близкую точку со стороны Garage, затем сплит Secret и Ramp.",
    roles: [["Стена — смок 1", "Смок на Outside с грузовика."], ["Стена — смок 2", "Второй смок стены / смок на красный контейнер."], ["Флешер", "Флешка через стену."], ["Молотов", "Молотов на близкую позицию у Garage."], ["Ramp", "Давление на Ramp для сплита Secret/Ramp."]],
    steps: [["Сначала стена", "Смоки на Outside и Red закрывают обзор с Heaven и Garage. Без одного смока переход превращается в тир."], ["Флешка и переход", "Флешка через стену, переход парами за смоками."], ["Зачистка и сплит", "Молотов на близкую позицию у Garage, затем сплит Secret и Ramp."]],
    utilityNotes: ["Порядок: смок на Outside → смок на красный контейнер → флешка на Outside → молотов на Outside"],
    note: ROLE_NOTE,
  },
  "tactic:nuk-upper-a": {
    title: "Заход на верхний A (3 игрока)",
    summary: "Смок на Yard прикрывает путь в Main, смок на Trophy закрывает кросс из Lobby; флешка на Rafters через Hut, молотов на Trophy, заход через Hut и Main одновременно.",
    roles: [["Смок на Yard", "Прикрывает путь в Main."], ["Смок на Trophy", "Закрывает угол кросса из Lobby."], ["Флешка + молотов", "Флешка на Rafters через Hut, молотов на Trophy."], ["Entry через Hut", "Заход через Hut."], ["Entry через Main", "Заход через Main одновременно."]],
    steps: [["Смоки", "Смок на Yard и смок на Trophy."], ["Флешка и молотов", "Флешка на Rafters через Hut, молотов на Trophy."], ["Заход вместе", "Hut и Main одновременно."]],
    utilityNotes: ["Лайнапов на Yard/Trophy в базе пока нет — добавь их с источником."],
    note: ROLE_NOTE,
  },
  "tactic:cac-a-execute": {
    title: "Простой выход на A",
    summary: "Смок на Highway, молотов на Forklift, флешка на A Main — базовый заход на A для Premier.",
    roles: [["Смокер — Highway", "Смок на Highway."], ["Молотов — Forklift", "Молотов на Forklift."], ["Флешер", "Флешка на A Main, когда entry готов выходить."], ["Entry", "Первым через A Main."], ["Mid", "Держит давление на Mid / Connector."]],
    steps: [["Highway", "Смок на Highway."], ["Forklift", "Молотов на Forklift."], ["Флешка и выход", "Флешка на A Main, когда первые игроки готовы выходить."]],
    note: "Источник показывает первые три шага; геометрию Cache в 2026 меняли. " + ROLE_NOTE,
  },

  // ───── Exercises
  "exercise:ex-aimbotz-150": { name: "Aim Botz — 150 хедшотов тапами", goal: "Стабильно ставить прицел в голову одиночными.", reps: "150 убийств", instructions: ["Запусти Aim Botz.", "Включи «только в голову», если хочешь строже.", "150 голов тапами; начни заново, если аим поплыл."] },
  "exercise:ex-aimbotz-strafe-track": { name: "Aim Botz — ведение головы в стрейфе", goal: "Держать прицел на голове в движении.", reps: "2 мин", instructions: ["Стрейфись влево-вправо перед ботами.", "2 минуты держи прицел на уровне головы."] },
  "exercise:ex-aimbotz-ak100": { name: "Aim Botz — 100 убийств с AK-47, только в голову", goal: "Быстрый разогрев аима перед матчем.", reps: "100 убийств", instructions: ["Только AK-47.", "Только в голову.", "Набери 100 убийств."] },
  "exercise:ex-aimbotz-50": { name: "Aim Botz — 50 голов тапами (лёгкий день)", goal: "Минимальная разминка, когда играешь не всерьёз.", reps: "50 убийств", instructions: ["50 голов тапами."] },
  "exercise:ex-recoil-ak-m4": { name: "Recoil Master — спреи AK и M4A4", goal: "Закрепить паттерны отдачи винтовок.", reps: "5 + 5 спреев", instructions: ["Выбери AK-47, средняя дистанция.", "5 полных спреев.", "Переключись на M4A4, 5 полных спреев."] },
  "exercise:ex-fastaim-50": { name: "Fast Aim/Reflex — 50 целей", goal: "Скорость реакции и флики.", reps: "50 целей", instructions: ["Только винтовки.", "Попади в 50 целей, балансируя скорость и точность."] },
  "exercise:ex-prefire-angles": { name: "Префаер в Yprac — 5–10 популярных углов", goal: "Узнать, где обычно стоят враги, а не выяснять это в рейтинге.", reps: "5–10 углов", instructions: ["Одна карта за сессию.", "Пройди 5–10 популярных углов.", "Для практики удержания используй режим защиты от ботов."] },
  "exercise:ex-counterstrafe-master": { name: "Контрстрейф", goal: "Полностью останавливаться перед каждым выстрелом.", reps: "5 мин", instructions: ["Нажми противоположную клавишу, чтобы остановиться (D при движении на A, A при движении на D), затем стреляй.", "В Counter-strafe Master получишь замер остановки и времени до выстрела.", "В обновлении 23 сентября 2026 Valve добавила индикатор контрстрейфа — используй его на тренировке."] },
  "exercise:ex-counterstrafe-botstop": { name: "Пики углов с замороженными ботами", goal: "Контрстрейф на реальных углах карты.", reps: "5 мин", instructions: ["Офлайн-игра, `sv_cheats 1; bot_stop 1`, чтобы заморозить ботов.", "Выглядывай из-за углов с контрстрейфом перед каждым выстрелом."] },
  "exercise:ex-dm-focus": { name: "Deathmatch с одним фокусом", goal: "Применять механику под реальным давлением.", reps: "10 мин", instructions: ["Матчмейкинг → Deathmatch (или комьюнити DM).", "Выбери ОДИН фокус: постановка прицела или контрстрейф перед каждым выстрелом."] },
  "exercise:ex-dm-hs-goal": { name: "Deathmatch — цель по проценту хедшотов", goal: "Измеримая цель, например 65% хедшотов.", reps: "1 матч", instructions: ["Поставь конкретную цель до захода.", "Запиши результат в заметки сессии."] },
  "exercise:ex-utility-yprac": { name: "Гранаты — лайнапы в Yprac Hub", goal: "Выучить в игре лайнапы из своей базы STRATIFY.", reps: "3× на лайнап", instructions: ["Открой режим гранат Yprac Hub на своей карте.", "Кинь каждый лайнап из своего списка 3 раза."], note: "Функция карты подтверждена; «3× на лайнап» — совет STRATIFY." },
  "exercise:ex-utility-practice": { name: "Гранаты — команды практики", goal: "Отработать лайнапы на настоящей карте с повтором броска и превью траектории.", reps: "Все лайнапы одного выхода", instructions: ["Создай игру для практики, открой консоль.", "sv_cheats 1; sv_infinite_ammo 1; ammo_grenade_limit_total 5; sv_grenade_trajectory_prac_pipreview 1; bot_kick; mp_restartgame 1", "bind \"x\" \"sv_rethrow_last_grenade\"; bind \"v\" \"noclip\"", "Кидай каждый лайнап, смотри через noclip, повторяй бросок, чтобы увидеть со стороны защиты."] },
  "exercise:ex-defense-mode": { name: "Режим защиты / ретейков — позиционирование", goal: "Понять, где стоять, когда перепикивать и как не отдавать трейды.", reps: "15 мин", instructions: ["Играй на серверах префаер-защиты / ретейков.", "Фокус на решениях о перепике, а не только на убийствах."] },
  "exercise:ex-demo-review": { name: "Разбор своего демо: только смерти", goal: "Найти повторяющиеся ошибки позиционирования.", reps: "1 демо", instructions: ["Открой демо последнего матча.", "Перематывай к каждой своей смерти.", "Отметь: прицел, позиция или инфа?"], note: "Обычная тренерская практика, но конкретного источника пока нет — добавь его в Источниках." },
  "exercise:ex-monesy-prefire": { name: "Префаер + DM (рутина m0NESY)", goal: "Рутина как у про: префаер ботов на популярных позициях, потом deathmatch.", reps: "1 карта + DM", instructions: ["Yprac / режим префаера на карте: боты стоят на самых популярных позициях.", "Закончи сессию deathmatch.", "По желанию — Aim Botz."], note: "Описана его рутина времён CS:GO (Yprac Arena)." },

  // ───── Programs
  "program:pg-30": { name: "Разминка перед FACEIT", focus: "Разогрев аима", description: "20-минутная рутина перед рейтингом от bo3.gg плюс короткий блок deathmatch с фокусом.", note: "Финальный 10-минутный блок DM — по SteamAnalyst." },
  "program:pg-60": { name: "Сессия механики", focus: "Аим + мувмент", description: "Разминка «для серьёзной сессии» от ProSettings, затем контрстрейф и deathmatch с измеримой целью.", note: "Каждое упражнение с источником; комбинация — от STRATIFY." },
  "program:pg-90": { name: "Механика + гранаты", focus: "Аим, префаер, лайнапы", description: "Блок механики, затем отработка гранат на карте, которую будешь играть.", note: "Каждое упражнение с источником; комбинация — от STRATIFY." },
  "program:pg-120": { name: "Полный тренировочный день", focus: "Всё + разбор", description: "Механика, префаер, гранаты, позиционирование и разбор демо.", note: "Блок разбора демо не проверен — см. его карточку." },

  // ───── Playbook
  "playbook:pb-s1mple-market": { title: "Быстрый смок в окно Market для раша B", summary: "s1mple показал смок в окно Market прямо из T Spawn — самый быстрый лайнап на это окно на тот момент, для поддержки раша на B.", details: ["Кидается из угла T Spawn у лестницы в Apartments, прицел в верх здания.", "Зачем: закрыть обзор из окна Market, чтобы раш на B успел до ротации CT.", "Опубликовано для CS:GO. В CS2 физика смоков изменилась — проверь на сервере для практики."], note: "Эпоха CS:GO." },
  "playbook:pb-monesy-routine": { title: "Тренировочная рутина m0NESY", summary: "Префаер с ботами на самых популярных позициях, в конце — deathmatch; иногда Aim Botz. Своими картами он назвал Yprac Arena и aim_botz.", details: ["Префаер по ботам на популярных позициях.", "Конец сессии — deathmatch.", "Иногда Aim Botz."], note: "Интервью до выхода CS2; на смену Yprac Arena пришёл Yprac Hub." },
  "playbook:pb-biegan-cs": { title: "Контрстрейф: отрабатывай каждый день", summary: "Совет Biegan: тренируй контрстрейф ежедневно, пока не станет автоматическим — сначала на тренировочных картах, потом в deathmatch.", details: ["Сначала тренировочные карты (без давления).", "Потом deathmatch, чтобы закрепить в реальных перестрелках."], note: "Цитата по CS2 Pulse." },

  // ───── Workshop
  "workshop:aimbotz": { description: "Стоячие и движущиеся боты, только в голову, броня, дистанции. Стандартная карта для разминки." },
  "workshop:recoilmaster": { description: "Подсказки спрея, замедление пуль, бесконечные патроны для винтовок и ПП." },
  "workshop:ypracHub": { description: "Режим префаера с 64+ маршрутами и режим гранат с 1400+ лайнапами на картах Active Duty." },
  "workshop:fastaim": { description: "Всплывающие цели для скорости реакции и фликов." },
  "workshop:fastwarmup": { description: "Компактно всё в одном: флики, режим 50 убийств на время, тренажёр спрея, флики с AWP." },
  "workshop:csmaster": { description: "Замеряет остановку и время до выстрела, оценивает точность, боты в стрейфе." },

  // ───── Maps
  "map:mirage": {
    overview: "Трёхлинейная карта, построенная вокруг контроля Mid. T обычно рано борются за Top Mid / Window, затем идут на A через Ramp + Palace или на B через Apartments + Short.",
    positions: [["m-p1", "Якорь A (Ticket / CT)", "Якорь", "Следит за Ramp и Palace, сообщает о ранних пушах. Описано в гайде bo3.gg по Mirage."], ["m-p2", "Jungle / Stairs", "Поддержка", "Играет перекрёстный с якорем A, может отойти в Connector."], ["m-p3", "Window / Sniper's Nest", "AWP", "Классическая позиция AWP для ранних фрагов на Mid."], ["m-p4", "Якорь B", "Якорь", "Держит выход из Apartments, часто с гранатами в Apartments."], ["m-p5", "Лёрк на Top Mid", "Лёркер", "Держит давление на Mid, пока команда заходит на сайт."]],
    routes: [["m-r1", "Сплит A: Ramp + Palace + Connector", "Ramp и Palace выходят вместе после смоков на CT, Jungle и Stairs (выход на A по MetaBot)."], ["m-r2", "B через Apartments + Short", "Заход из Apartments, пока игрок на Short режет ротацию с Mid (выход на B по MetaBot)."], ["m-r3", "Контроль Mid", "Смок в Window, забрать Top Mid, затем Connector/Short — угроза обоим сайтам."], ["m-r4", "Ротация CT B → A через Market", "Основной путь ротации за CT."]],
    note: MAP_NOTE,
  },
  "map:inferno": {
    overview: "Тесная карта с большим количеством гранат. Banana — ключевой бой за T для B; A атакуют через Apartments, Mid и Short. CT рано и жёстко борются за Banana.",
    positions: [["i-p1", "Контроль Banana", "Игрок на Banana", "Рано борется за Banana с гранатами (у Valve смоки на Banana и Banana Half-Wall — официальные за CT)."], ["i-p2", "Coffins", "Якорь B", "Глубокая позиция на B, которую T смокают при выходе."], ["i-p3", "Pit", "Якорь A", "Глубокая позиция на A, контролирует выходы с Short и Apartments."], ["i-p4", "Arch / Library", "Ротатор", "Связывает A и CT; при сплите на A её смокают."]],
    routes: [["i-r1", "Взять Banana → B", "Сначала забрать Banana, затем смоки на CT + Coffins и заход (простой выход на B по ExpCarry)."], ["i-r2", "A через Apartments + Mid", "Apartments/Balcony вместе с давлением на Mid/Short; смоки на Arch, Library и Moto изолируют сайт."], ["i-r3", "Ротация CT A → B через CT", "Основной путь ротации — его и отрезает смок на CT."]],
    note: MAP_NOTE,
  },
  "map:dust2": {
    overview: "Длинные простреливаемые линии и простая структура. T сплитят A через Long + Short (Catwalk) или заходят на B через Upper Tunnels. Смоки на Xbox и кросс A — основа гранат за T.",
    positions: [["d-p1", "Long", "Игрок на Long", "Рано оспаривает A Long; часто со смоком на двери Long из CT Spawn."], ["d-p2", "Short / Cat", "Якорь A", "Держит Catwalk и помогает Long."], ["d-p3", "Сайт B", "Якорь B", "Держит выход из туннелей."], ["d-p4", "CT Mid / двери Mid", "Mid / ротатор", "Инфа о пушах на Mid, ротация на любой сайт."]],
    routes: [["d-r1", "Взятие A Long", "Флешка на двери Long для тайминга, затем смок на кросс A для перехода на сайт (PC Invasion / Dexerto)."], ["d-r2", "A Short через Xbox", "Смок на Xbox даёт T перейти на Short, меньше светясь для Mid и CT."], ["d-r3", "B через Upper Tunnels", "Смоки на двери / окно B изолируют сайт от ротаций CT."]],
    note: MAP_NOTE,
  },
  "map:ancient": {
    overview: "Храм в джунглях с упором на Mid. Donut и Mid связывают оба сайта; основные входы — B Ramp и A Main.",
    positions: [["an-p1", "Donut", "Поддержка A", "Оспаривает контроль Donut."], ["an-p2", "Сайт B", "Якорь B", "Держит B Ramp."]],
    routes: [["an-r1", "Заход по B Ramp", "Прямой заход на B; часто вместе с давлением через Cave."], ["an-r2", "Сплит A Main + Donut", "Контроль Donut открывает сплит с A Main."]],
    note: MAP_NOTE,
  },
  "map:anubis": {
    overview: "Карта от комьюнити с водой на Mid. Контроль Connector и Canal решает ротации.",
    positions: [["anu-p1", "Connector", "Mid", "Держит пуши через воду/Mid."]],
    routes: [["anu-r1", "Mid → Connector → A", "Контроль Mid для сплита A вместе с A Main."]],
    note: MAP_NOTE,
  },
  "map:nuke": {
    overview: "Вертикальная карта с сайтами друг над другом. Ключевые бои — контроль Outside (Secret / Main) и Ramp; Heaven нависает над A.",
    positions: [["n-p1", "Heaven", "Якорь A", "Высокая позиция над сайтом A."]],
    routes: [["n-r1", "Ramp → B", "Взятие Ramp и заход на нижний B."]],
    note: MAP_NOTE,
  },
  "map:cache": {
    overview: "Вернулась в Active Duty в июле 2026 вместо Overpass. Контроль Mid (Z / Connector) разделяет A Main и B.",
    positions: [["c-p1", "Сайт A", "Якорь A", "Держит A Main."]],
    routes: [["c-r1", "A Main", "Прямой заход через A Main."]],
    note: "Радар: официальный overview из файлов CS2 (© Valve). Геометрию Cache в 2026 меняли несколько раз — маркеры приблизительны.",
  },
  "map:overpass": {
    overview: "Ушла из Active Duty 8 июля 2026 (заменена на Cache). Бои за Monster и Connector решают B; Long/Fountain ведут на A.",
    routes: [["o-r1", "Monster → B", "Основной заход на B."]],
    note: MAP_NOTE,
  },
  "map:train": {
    overview: "Убрана из Active Duty 22 января 2026 (вернулся Anubis). Ivy и Main — на A; верхний/нижний залы — на B.",
    routes: [["t-r1", "Сплит Ivy + Main", "Давление через Ivy с поддержкой из T Main."]],
    note: MAP_NOTE,
  },
};
