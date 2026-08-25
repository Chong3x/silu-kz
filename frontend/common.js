/* ========================================================
   common.js — 四个页面共用的数据、文案与工具函数
   ======================================================== */

/* ---------- 多语言 UI 文案 ---------- */
const translations = {
  zh: {
    siteName:"Silu",
    navHome:"首页", navFavorites:"收藏", navProfile:"我的发布", navPost:"发布信息",
    heroEyebrow:"哈萨克斯坦 · 华人生活信息平台",
    heroTitle:"连接在哈萨克斯坦的每一位华人",
    heroSub:"找室友、找房子、找工作、找合作伙伴 — 一个属于华人社区的信息集散地",
    searchPlaceholder:"搜索：城市、职位、房源关键词…", searchBtn:"搜索",
    statListings:"条信息", statCities:"座城市", statCats:"大分类",
    catSectionTitle:"按分类浏览", allListings:"全部信息", clearFilter:"清除筛选 ✕",
    footerTagline:"服务哈萨克斯坦华人社区的信息发布平台",
    footerNote:"万事顺遂",
    noResults:"暂无相关信息", allOption:"全部分类",

    favoritesTitle:"我的收藏", noFavorites:"你还没有收藏任何信息，去首页看看吧。",
    profileTitle:"我的发布", noMyListings:"你还没有发布任何信息。",
    editBtn:"编辑", deleteBtn:"删除", confirmDelete:"确定要删除这条信息吗？",

    postTitleNew:"发布一条信息", postTitleEdit:"编辑信息",
    formCategory:"分类", formTitleLabel:"标题",
    formTitlePh:"例如：市中心两居室出租", formCity:"城市", formContact:"联系方式",
    formContactPh:"微信 / WhatsApp / 电话", formDescription:"详细描述",
    uploadLabel:"上传照片", uploadHint:"最多 4 张，点击或拖拽图片到此处",
    formCancel:"取消", formSubmit:"发布", formSave:"保存修改",
    treasureFreeNotice:"此类别不收取任何费用", treasureFreeBadge:"永久免费",
    recommendBtn:"推荐+1", recommendedBtn:"已推荐", recommendCountLabel:"{n}人推荐",
    recommendSuccess:"推荐成功！", recommendAlready:"你已经推荐过这条了",

    toastPosted:"发布成功！", toastUpdated:"已更新", toastDeleted:"已删除",
    toastFavAdd:"已加入收藏", toastFavRemove:"已取消收藏", toastMaxPhotos:"最多只能上传 4 张照片",
    backHome:"← 返回首页",
    listingNotFound:"这条信息不存在，或者已经被下架了。",
    photoCounter:"{cur} / {total}",

    navLogin:"登录 / 注册", logoutBtn:"退出登录", welcomeUser:"你好，",
    loginTitle:"登录账号", registerTitle:"注册新账号",
    loginPageTitle:"登录 Silu", registerPageTitle:"加入 Silu",
    loginIntro:"欢迎回来，选择一种方式登录", orDivider:"或",
    phoneLoginDisabledNotice:"📮 手机验证码登录暂时维护中，请使用上方 Google 登录。给您带来不便，敬请谅解。",
    homeBanner:"📢 首次发广告免费！分享朋友圈满24小时再送1次免费发布机会",
    tabLogin:"登录", tabRegister:"注册",
    formName:"姓名", formPhone:"手机号 / 邮箱", formPassword:"密码", formPasswordPh:"至少6位",
    submitLogin:"登录", submitRegister:"注册并登录",
    noAccountYet:"还没有账号？", alreadyHaveAccount:"已有账号？",
    switchToRegister:"去注册", switchToLogin:"去登录",
    errorUserExists:"该手机号/邮箱已注册", errorInvalidLogin:"账号或密码不正确",
    errorFillAll:"请填写完整信息",
    loginRequiredMsg:"请先登录后再发布或查看这部分内容", goLogin:"前往登录",
    passwordHint:"该网站为演示项目，密码仅做了基础加密存储，请勿使用你其他重要账号的密码。",
    dateLabel:"发布于",

    statusPendingPayment:"待确认付款", statusPending:"审核中", statusActive:"已上线",
    statusRejected:"已拒绝", statusExpired:"已过期", statusHidden:"已下架",
    daysLeftLabel:"剩余 {n} 天", expiringSoonLabel:"即将过期", rejectReasonLabel:"拒绝原因",

    categoryLabel:"分类", planFree:"免费发布(剩余{n}次)", planNoFree:"没有免费次数了",
    plan10:"10天 · 500坚戈", plan30:"30天 · 1000坚戈(推荐)",
    kaspiPayTitle:"Kaspi 转账信息", kaspiPayHint:"请按下方信息完成转账，然后上传转账截图，等待管理员确认后广告即可发布。",
    kaspiPhoneLabel:"收款手机号", kaspiNameLabel:"收款人姓名", uploadPaymentScreenshot:"上传转账截图",
    submitToReview:"提交审核",

    otpPhoneLabel:"手机号", otpSendBtn:"获取验证码", otpResend:"重新发送({n}s)", otpCodeLabel:"验证码",
    otpNameLabel:"姓名", otpLoginBtn:"登录 / 注册", googleLoginBtn:"使用 Google 登录",
    adminRegisterPageTitle:"注册管理员账号",
    adminInviteCodeLabel:"管理员邀请码", adminLoginTitle:"管理员登录", userLoginTitle:"用户登录",
    adminLoginIntro:"仅限管理员使用，请用手机验证码登录", adminInviteHint:"每次登录都需要填写正确的管理员邀请码",
    goUserLogin:"我是普通用户", goAdminLogin:"我是管理员", devOtpHint:"开发模式，验证码是: {code}",

    navFeedback:"意见反馈", navReferral:"分享有礼", navAdmin:"管理后台",
    feedbackTitle:"意见反馈", feedbackTypeLabel:"反馈类型", feedbackContentLabel:"反馈内容",
    feedbackContactLabel:"联系方式(选填)", feedbackTypeBug:"故障问题", feedbackTypeSuggestion:"建议",
    feedbackTypeComplaint:"投诉", feedbackTypeOther:"其他", feedbackSubmitBtn:"提交反馈", feedbackThanks:"感谢你的反馈！",

    referralTitle:"🎁 分享有礼", referralCopy:"将网站分享到朋友圈/Instagram/TikTok，截图上传，审核通过后即获1次免费发布机会（每人限参与1次）",
    referralRule:"审核要求：帖子需包含网站链接且保留至少24小时，违规者将收回奖励。",
    referralUploadLabel:"上传分享截图(不超过2MB)", referralSubmitBtn:"提交审核",
    referralStatusPending:"审核中", referralStatusApproved:"已通过，奖励已发放", referralStatusRejected:"未通过",
    referralAlreadyGranted:"你已经领取过分享奖励啦", referralSubmitted:"提交成功，请等待管理员审核",

    notifEmpty:"暂无通知", notifMarkAllRead:"全部标记已读",

    adminDashTitle:"管理后台", adminTabPayments:"待确认付款", adminTabListings:"新发布待审核", adminTabEdited:"编辑待复审",
    adminTabFeedback:"意见反馈", adminTabReferrals:"分享审核",
    adminConfirmPay:"确认收款", adminApprove:"通过", adminReject:"拒绝",
    adminRejectReasonPh:"填写拒绝原因(可选)", adminNoData:"暂无数据",
    adminTotalUsers:"注册用户总数", adminTotalAdmins:"管理员人数", adminPaidBadge:"付费", adminFreeBadge:"免费",
    adminMarkRead:"标记已读", adminMarkResolved:"标记已解决",

    adminTabActive:"已上线广告", adminHide:"下架", adminUnhide:"恢复上线", adminDelete:"删除",
    confirmHideListing:"确定要下架这条广告吗？下架后用户在首页看不到，但数据不会丢，随时可以恢复。",
    confirmUnhideListing:"确定要恢复这条广告上线吗？",
    confirmAdminDelete:"确定要永久删除这条广告吗？此操作无法撤销。",
    ipLabel:"发布IP",

    navDisclaimer:"免责声明",
    disclaimerShort:"本站信息均由用户自行发布，平台不对内容真实性负责，交易前请自行核实。",
    disclaimerReadMore:"查看完整声明 →",
    disclaimerPageTitle:"免责声明",
    disclaimerP1:"丝路驿站（以下简称“本平台”）是一个供用户自行发布和浏览生活信息的平台。所有广告、招聘、房源、二手交易等内容均由用户自行发布，本平台仅提供信息展示和发布渠道，不对内容的真实性、准确性、合法性作任何担保。",
    disclaimerP2:"在与其他用户联系、交易或提供个人信息之前，请务必自行核实对方身份、房源/商品的真实情况，谨慎判断，在未核实清楚前不要支付定金或转账。因用户发布的信息不实、交易纠纷、人身或财产损失等造成的后果，本平台不承担任何直接或间接责任。",
    disclaimerP3:"本平台对所有发布的广告进行基础的人工审核，但审核内容主要针对是否违反法律法规、是否存在明显欺诈或违规内容，不代表对信息真实性的实质性核实。",
    disclaimerP4:"如果您发现虚假信息、诈骗行为或其他违规内容，欢迎通过“意见反馈”页面告知我们，我们会尽快处理。",

    daysLegendTitle:"剩余天数颜色说明",
    daysLegendGreen:"绿色：剩余7天以上", daysLegendYellow:"黄色：剩余3-7天", daysLegendRed:"红色：剩余3天以内，即将过期"
  },
  ru: {
    siteName:"Silu",
    navHome:"Главная", navFavorites:"Избранное", navProfile:"Объявления", navPost:"Разместить",
    heroEyebrow:"Казахстан · Платформа для китайской общины",
    heroTitle:"Место встречи китайской общины в Казахстане",
    heroSub:"Соседи по квартире, аренда жилья, работа, бизнес-партнёры — единая доска объявлений для общины",
    searchPlaceholder:"Поиск: город, вакансия, ключевые слова…", searchBtn:"Искать",
    statListings:"объявлений", statCities:"городов", statCats:"категорий",
    catSectionTitle:"Категории", allListings:"Все объявления", clearFilter:"Сбросить фильтр ✕",
    footerTagline:"Платформа объявлений для китайской общины в Казахстане",
    footerNote:"Дорогу осилит идущий",
    noResults:"Ничего не найдено", allOption:"Все категории",

    favoritesTitle:"Избранное", noFavorites:"У вас пока нет избранных объявлений — загляните на главную.",
    profileTitle:"Мои объявления", noMyListings:"Вы ещё не разместили ни одного объявления.",
    editBtn:"Изменить", deleteBtn:"Удалить", confirmDelete:"Точно удалить это объявление?",

    postTitleNew:"Новое объявление", postTitleEdit:"Редактировать объявление",
    formCategory:"Категория", formTitleLabel:"Заголовок",
    formTitlePh:"Например: сдаётся 2-комнатная квартира в центре", formCity:"Город", formContact:"Контакт",
    formContactPh:"WeChat / WhatsApp / телефон", formDescription:"Описание",
    uploadLabel:"Фотографии", uploadHint:"До 4 фото — нажмите или перетащите сюда",
    formCancel:"Отмена", formSubmit:"Опубликовать", formSave:"Сохранить изменения",
    treasureFreeNotice:"Эта категория совершенно бесплатна", treasureFreeBadge:"Всегда бесплатно",
    recommendBtn:"Рекомендую +1", recommendedBtn:"Рекомендовано", recommendCountLabel:"{n} рекомендаций",
    recommendSuccess:"Спасибо за рекомендацию!", recommendAlready:"Вы уже рекомендовали это",

    toastPosted:"Объявление опубликовано!", toastUpdated:"Изменения сохранены", toastDeleted:"Удалено",
    toastFavAdd:"Добавлено в избранное", toastFavRemove:"Убрано из избранного", toastMaxPhotos:"Можно загрузить не более 4 фото",
    backHome:"← На главную",
    listingNotFound:"Это объявление не найдено или было снято с публикации.",
    photoCounter:"{cur} / {total}",

    navLogin:"Войти", logoutBtn:"Выйти", welcomeUser:"Привет, ",
    loginTitle:"Вход в аккаунт", registerTitle:"Регистрация",
    loginPageTitle:"Вход в Silu", registerPageTitle:"Присоединиться к Silu",
    loginIntro:"С возвращением! Выберите способ входа", orDivider:"или",
    phoneLoginDisabledNotice:"📮 Вход по SMS-коду временно на обслуживании. Пожалуйста, используйте вход через Google выше. Приносим извинения за неудобства.",
    homeBanner:"📢 Первое объявление — бесплатно! Поделитесь у себя 24 часа и получите ещё одну бесплатную публикацию",
    tabLogin:"Вход", tabRegister:"Регистрация",
    formName:"Имя", formPhone:"Телефон / Email", formPassword:"Пароль", formPasswordPh:"Минимум 6 символов",
    submitLogin:"Войти", submitRegister:"Зарегистрироваться",
    noAccountYet:"Нет аккаунта?", alreadyHaveAccount:"Уже есть аккаунт?",
    switchToRegister:"Зарегистрироваться", switchToLogin:"Войти",
    errorUserExists:"Этот телефон/email уже зарегистрирован", errorInvalidLogin:"Неверный логин или пароль",
    errorFillAll:"Заполните все поля",
    loginRequiredMsg:"Пожалуйста, войдите, чтобы продолжить", goLogin:"Перейти ко входу",
    passwordHint:"Это демо-проект: пароль хранится с базовым шифрованием, не используйте пароль от других важных аккаунтов.",
    dateLabel:"Опубликовано",

    statusPendingPayment:"Ожидает оплаты", statusPending:"На проверке", statusActive:"Опубликовано",
    statusRejected:"Отклонено", statusExpired:"Истекло", statusHidden:"Снято с публикации",
    daysLeftLabel:"Осталось {n} дн.", expiringSoonLabel:"Скоро истекает", rejectReasonLabel:"Причина отказа",

    categoryLabel:"Категория", planFree:"Бесплатно (осталось {n})", planNoFree:"Бесплатные лимиты закончились",
    plan10:"10 дней · 500 KZT", plan30:"30 дней · 1000 KZT (рекомендуем)",
    kaspiPayTitle:"Реквизиты Kaspi", kaspiPayHint:"Переведите по реквизитам ниже, загрузите скриншот оплаты и дождитесь подтверждения администратора.",
    kaspiPhoneLabel:"Номер получателя", kaspiNameLabel:"Имя получателя", uploadPaymentScreenshot:"Загрузить скриншот оплаты",
    submitToReview:"Отправить на проверку",

    otpPhoneLabel:"Телефон", otpSendBtn:"Получить код", otpResend:"Повторно ({n}с)", otpCodeLabel:"Код подтверждения",
    otpNameLabel:"Имя", otpLoginBtn:"Войти / Зарегистрироваться", googleLoginBtn:"Войти через Google",
    adminRegisterPageTitle:"Регистрация администратора",
    adminInviteCodeLabel:"Код приглашения администратора", adminLoginTitle:"Вход для администратора", userLoginTitle:"Вход для пользователя",
    adminLoginIntro:"Только для администраторов. Войдите по SMS-коду", adminInviteHint:"Код приглашения нужно вводить при каждом входе",
    goUserLogin:"Я обычный пользователь", goAdminLogin:"Я администратор", devOtpHint:"Режим разработки, код: {code}",

    navFeedback:"Обратная связь", navReferral:"Бонусы", navAdmin:"Админ-панель",
    feedbackTitle:"Обратная связь", feedbackTypeLabel:"Тип обращения", feedbackContentLabel:"Содержание",
    feedbackContactLabel:"Контакт (необязательно)", feedbackTypeBug:"Ошибка", feedbackTypeSuggestion:"Предложение",
    feedbackTypeComplaint:"Жалоба", feedbackTypeOther:"Другое", feedbackSubmitBtn:"Отправить", feedbackThanks:"Спасибо за ваш отзыв!",

    referralTitle:"🎁 Поделись и получи", referralCopy:"Поделитесь сайтом в WeChat Moments/Instagram/TikTok, загрузите скриншот — после проверки вы получите 1 бесплатную публикацию (можно участвовать только 1 раз)",
    referralRule:"Требования: пост должен содержать ссылку на сайт и провисеть не менее 24 часов, иначе награда будет отменена.",
    referralUploadLabel:"Загрузите скриншот (до 2МБ)", referralSubmitBtn:"Отправить на проверку",
    referralStatusPending:"На проверке", referralStatusApproved:"Одобрено, награда начислена", referralStatusRejected:"Отклонено",
    referralAlreadyGranted:"Вы уже получили награду за приглашение", referralSubmitted:"Отправлено, ожидайте проверки администратора",

    notifEmpty:"Пока нет уведомлений", notifMarkAllRead:"Отметить всё как прочитанное",

    adminDashTitle:"Админ-панель", adminTabPayments:"Ожидают оплаты", adminTabListings:"Новые на проверке", adminTabEdited:"Отредактированные",
    adminTabFeedback:"Обратная связь", adminTabReferrals:"Проверка приглашений",
    adminConfirmPay:"Подтвердить оплату", adminApprove:"Одобрить", adminReject:"Отклонить",
    adminRejectReasonPh:"Причина отказа (необязательно)", adminNoData:"Нет данных",
    adminTotalUsers:"Всего пользователей", adminTotalAdmins:"Администраторов", adminPaidBadge:"Платно", adminFreeBadge:"Бесплатно",
    adminMarkRead:"Отметить прочитанным", adminMarkResolved:"Отметить решённым",

    adminTabActive:"Опубликованные", adminHide:"Снять с публикации", adminUnhide:"Опубликовать снова", adminDelete:"Удалить",
    confirmHideListing:"Снять это объявление с публикации? Оно исчезнет с сайта, но данные сохранятся, можно будет вернуть.",
    confirmUnhideListing:"Снова опубликовать это объявление?",
    confirmAdminDelete:"Удалить это объявление навсегда? Действие нельзя отменить.",
    ipLabel:"IP публикации",

    navDisclaimer:"Отказ от ответственности",
    disclaimerShort:"Вся информация на сайте размещается пользователями самостоятельно. Платформа не несёт ответственности за достоверность контента — проверяйте данные перед сделкой.",
    disclaimerReadMore:"Читать полностью →",
    disclaimerPageTitle:"Отказ от ответственности",
    disclaimerP1:"Silu (далее — «платформа») — это площадка, где пользователи самостоятельно размещают и просматривают объявления. Все объявления, вакансии, предложения по аренде жилья, товары и услуги публикуются пользователями. Платформа предоставляет только техническую возможность размещения и не гарантирует достоверность, точность или законность содержания.",
    disclaimerP2:"Перед тем как связаться с другим пользователем, заключить сделку или передать личные данные, обязательно проверяйте личность собеседника и реальное состояние жилья/товара самостоятельно. Не переводите деньги и не вносите предоплату, пока не убедитесь в достоверности информации. Платформа не несёт прямой или косвенной ответственности за ущерб, возникший из-за недостоверных объявлений, споров между пользователями или иных потерь.",
    disclaimerP3:"Все объявления проходят базовую модерацию, направленную на выявление нарушений законодательства и явного мошенничества, но это не является подтверждением достоверности содержания объявления.",
    disclaimerP4:"Если вы обнаружили недостоверное объявление, мошенничество или другое нарушение, пожалуйста, сообщите нам через страницу «Обратная связь» — мы разберёмся как можно быстрее.",

    daysLegendTitle:"Что означают цвета",
    daysLegendGreen:"Зелёный: осталось больше 7 дней", daysLegendYellow:"Жёлтый: осталось 3–7 дней", daysLegendRed:"Красный: осталось ≤3 дней, скоро истекает"
  },
  kk: {
    siteName:"Silu",
    navHome:"Басты бет", navFavorites:"Таңдаулылар", navProfile:"Хабарландырулар", navPost:"Жариялау",
    heroEyebrow:"Қазақстан · Қытай қауымдастығына арналған алаң",
    heroTitle:"Қазақстандағы қытай қауымдастығын байланыстырады",
    heroSub:"Пәтерлес, жалдау, жұмыс, іскерлік серіктестер — қауымдастыққа арналған бірыңғай хабарландыру тақтасы",
    searchPlaceholder:"Іздеу: қала, лауазым, кілт сөздер…", searchBtn:"Іздеу",
    statListings:"хабарландыру", statCities:"қала", statCats:"санат",
    catSectionTitle:"Санаттар бойынша шолу", allListings:"Барлық хабарландырулар", clearFilter:"Сүзгіні тазалау ✕",
    footerTagline:"Қазақстандағы қытай қауымдастығына арналған хабарландыру алаңы",
    footerNote:"Қолы ашықтың — жолы ашық",
    noResults:"Ештеңе табылмады", allOption:"Барлық санаттар",

    favoritesTitle:"Таңдаулылар", noFavorites:"Әзірге таңдаулы хабарландыру жоқ, басты бетке өтіңіз.",
    profileTitle:"Менің хабарландыруларым", noMyListings:"Сіз әлі ешбір хабарландыру жарияламадыңыз.",
    editBtn:"Өңдеу", deleteBtn:"Жою", confirmDelete:"Бұл хабарландыруды жоюға сенімдісіз бе?",

    postTitleNew:"Хабарландыру қосу", postTitleEdit:"Хабарландыруды өңдеу",
    formCategory:"Санат", formTitleLabel:"Тақырып",
    formTitlePh:"Мысалы: орталықта 2 бөлмелі пәтер жалға беріледі", formCity:"Қала", formContact:"Байланыс",
    formContactPh:"WeChat / WhatsApp / телефон", formDescription:"Сипаттама",
    uploadLabel:"Фотосуреттер", uploadHint:"Ең көбі 4 сурет — басыңыз немесе осында тартып апарыңыз",
    formCancel:"Бас тарту", formSubmit:"Жариялау", formSave:"Өзгерістерді сақтау",
    treasureFreeNotice:"Бұл санат мүлдем тегін", treasureFreeBadge:"Әрқашан тегін",
    recommendBtn:"Ұсыну +1", recommendedBtn:"Ұсынылды", recommendCountLabel:"{n} ұсыныс",
    recommendSuccess:"Рахмет, ұсыныс қабылданды!", recommendAlready:"Сіз мұны бұрын ұсындыңыз",

    toastPosted:"Сәтті жарияланды!", toastUpdated:"Өзгерістер сақталды", toastDeleted:"Жойылды",
    toastFavAdd:"Таңдаулыларға қосылды", toastFavRemove:"Таңдаулылардан алынды", toastMaxPhotos:"Ең көбі 4 сурет жүктеуге болады",
    backHome:"← Басты бетке",
    listingNotFound:"Бұл хабарландыру табылмады немесе жарияланымнан алынды.",
    photoCounter:"{cur} / {total}",

    navLogin:"Кіру", logoutBtn:"Шығу", welcomeUser:"Сәлем, ",
    loginTitle:"Аккаунтқа кіру", registerTitle:"Тіркелу",
    loginPageTitle:"Silu-ға кіру", registerPageTitle:"Silu-ға қосылу",
    loginIntro:"Қош келдіңіз! Кіру тәсілін таңдаңыз", orDivider:"немесе",
    phoneLoginDisabledNotice:"📮 SMS-код арқылы кіру уақытша техникалық қызмет көрсетуде. Жоғарыдағы Google арқылы кіруді пайдаланыңыз. Ыңғайсыздық үшін кешірім сұраймыз.",
    homeBanner:"📢 Алғашқы хабарландыру — тегін! Әлеуметтік желіде 24 сағат бөлісіп, тағы 1 тегін мүмкіндік алыңыз",
    tabLogin:"Кіру", tabRegister:"Тіркелу",
    formName:"Аты", formPhone:"Телефон / Email", formPassword:"Құпия сөз", formPasswordPh:"Кемінде 6 таңба",
    submitLogin:"Кіру", submitRegister:"Тіркеліп кіру",
    noAccountYet:"Аккаунтыңыз жоқ па?", alreadyHaveAccount:"Аккаунтыңыз бар ма?",
    switchToRegister:"Тіркелу", switchToLogin:"Кіру",
    errorUserExists:"Бұл телефон/email тіркелген", errorInvalidLogin:"Логин немесе құпия сөз қате",
    errorFillAll:"Барлық өрісті толтырыңыз",
    loginRequiredMsg:"Жалғастыру үшін алдымен кіріңіз", goLogin:"Кіру бетіне өту",
    passwordHint:"Бұл демо-жоба: құпия сөз негізгі шифрлаумен сақталады, басқа маңызды аккаунттардың құпия сөзін қолданбаңыз.",
    dateLabel:"Жарияланды",

    statusPendingPayment:"Төлем күтілуде", statusPending:"Тексерілуде", statusActive:"Жарияланды",
    statusRejected:"Қабылданбады", statusExpired:"Мерзімі өтті", statusHidden:"Жарияланымнан алынды",
    daysLeftLabel:"{n} күн қалды", expiringSoonLabel:"Жақында аяқталады", rejectReasonLabel:"Бас тарту себебі",

    categoryLabel:"Санат", planFree:"Тегін ({n} рет қалды)", planNoFree:"Тегін лимит бітті",
    plan10:"10 күн · 500 KZT", plan30:"30 күн · 1000 KZT (ұсынылады)",
    kaspiPayTitle:"Kaspi деректемелері", kaspiPayHint:"Төменде көрсетілген деректемелер бойынша төлем жасап, түбіртек скриншотын жүктеңіз, әкімші растағанша күтіңіз.",
    kaspiPhoneLabel:"Алушының нөірі", kaspiNameLabel:"Алушының аты", uploadPaymentScreenshot:"Төлем скриншотын жүктеу",
    submitToReview:"Тексеруге жіберу",

    otpPhoneLabel:"Телефон", otpSendBtn:"Код алу", otpResend:"Қайта ({n}с)", otpCodeLabel:"Растау коды",
    otpNameLabel:"Аты", otpLoginBtn:"Кіру / Тіркелу", googleLoginBtn:"Google арқылы кіру",
    adminRegisterPageTitle:"Әкімші тіркеу",
    adminInviteCodeLabel:"Әкімші шақыру коды", adminLoginTitle:"Әкімші кірісі", userLoginTitle:"Қолданушы кірісі",
    adminLoginIntro:"Тек әкімшілерге арналған. SMS-код арқылы кіріңіз", adminInviteHint:"Шақыру кодын әр кіру сайын енгізу қажет",
    goUserLogin:"Мен қарапайым қолданушымын", goAdminLogin:"Мен әкімшімін", devOtpHint:"Әзірлеу режимі, код: {code}",

    navFeedback:"Кері байланыс", navReferral:"Сыйлықтар", navAdmin:"Әкімші панелі",
    feedbackTitle:"Кері байланыс", feedbackTypeLabel:"Өтініш түрі", feedbackContentLabel:"Мазмұны",
    feedbackContactLabel:"Байланыс (міндетті емес)", feedbackTypeBug:"Ақаулық", feedbackTypeSuggestion:"Ұсыныс",
    feedbackTypeComplaint:"Шағым", feedbackTypeOther:"Басқа", feedbackSubmitBtn:"Жіберу", feedbackThanks:"Пікіріңіз үшін рахмет!",

    referralTitle:"🎁 Бөліс және сыйлық ал", referralCopy:"Сайтты WeChat Moments/Instagram/TikTok-қа бөлісіп, скриншот жүктеңіз — тексеруден өткен соң 1 тегін жариялау мүмкіндігін аласыз (әр адам 1 рет қана қатыса алады)",
    referralRule:"Талап: жазбада сайт сілтемесі болуы және кемінде 24 сағат тұруы керек, әйтпесе сыйлық қайтарылады.",
    referralUploadLabel:"Скриншот жүктеу (2МБ дейін)", referralSubmitBtn:"Тексеруге жіберу",
    referralStatusPending:"Тексерілуде", referralStatusApproved:"Мақұлданды, сыйлық берілді", referralStatusRejected:"Қабылданбады",
    referralAlreadyGranted:"Сіз бөлісу сыйлығын алдыңыз", referralSubmitted:"Жіберілді, әкімші тексеруін күтіңіз",

    notifEmpty:"Әзірге хабарландыру жоқ", notifMarkAllRead:"Барлығын оқылды деп белгілеу",

    adminDashTitle:"Әкімші панелі", adminTabPayments:"Төлем күтілуде", adminTabListings:"Жаңа тексеру", adminTabEdited:"Өңделгендер",
    adminTabFeedback:"Кері байланыс", adminTabReferrals:"Бөлісу тексеруі",
    adminConfirmPay:"Төлемді растау", adminApprove:"Мақұлдау", adminReject:"Қабылдамау",
    adminRejectReasonPh:"Бас тарту себебі (міндетті емес)", adminNoData:"Деректер жоқ",
    adminTotalUsers:"Барлық пайдаланушылар", adminTotalAdmins:"Әкімшілер саны", adminPaidBadge:"Ақылы", adminFreeBadge:"Тегін",
    adminMarkRead:"Оқылды деп белгілеу", adminMarkResolved:"Шешілді деп белгілеу",

    adminTabActive:"Жарияланғандар", adminHide:"Жариялаудан алу", adminUnhide:"Қайта жариялау", adminDelete:"Жою",
    confirmHideListing:"Бұл хабарландыруды жариялаудан алуды растайсыз ба? Ол сайттан жоғалады, бірақ деректер сақталады, кейін қайта жариялауға болады.",
    confirmUnhideListing:"Бұл хабарландыруды қайта жариялауды растайсыз ба?",
    confirmAdminDelete:"Бұл хабарландыруды біржола жоюды растайсыз ба? Бұл әрекетті болдырмауға болмайды.",
    ipLabel:"Жариялау IP",

    navDisclaimer:"Жауапкершіліктен бас тарту",
    disclaimerShort:"Сайттағы барлық ақпаратты пайдаланушылар өздері жариялайды. Платформа мазмұнның шынайылығына жауап бермейді — мәміле алдында өзіңіз тексеріңіз.",
    disclaimerReadMore:"Толық мәтінді оқу →",
    disclaimerPageTitle:"Жауапкершіліктен бас тарту",
    disclaimerP1:"Silu (бұдан әрі — «платформа») — пайдаланушылар хабарландыруларды өздері жариялайтын және қарайтын алаң. Барлық хабарландырулар, вакансиялар, жалдау, тауар мен қызмет ұсыныстарын пайдаланушылар өздері жариялайды. Платформа тек техникалық мүмкіндік береді және мазмұнның шынайылығына, дұрыстығына, заңдылығына кепілдік бермейді.",
    disclaimerP2:"Басқа пайдаланушымен байланысу, мәміле жасау немесе жеке деректерді беру алдында әңгімелесушінің жеке басын және тұрғын үй/тауардың нақты жағдайын өзіңіз тексеріңіз. Ақпараттың шынайылығына көз жеткізгенше ақша аудармаңыз немесе алдын ала төлем жасамаңыз. Платформа пайдаланушылардың дұрыс емес хабарландыруларынан, дауларынан немесе басқа да зияннан туындаған тікелей немесе жанама зиян үшін жауап бермейді.",
    disclaimerP3:"Барлық хабарландырулар заң бұзушылықтар мен айқын алаяқтықты анықтауға бағытталған негізгі модерациядан өтеді, бірақ бұл хабарландыру мазмұнының шынайылығын растамайды.",
    disclaimerP4:"Егер сіз шынайы емес хабарландыруды, алаяқтықты немесе басқа бұзушылықты байқасаңыз, «Кері байланыс» беті арқылы бізге хабарлаңыз — біз жедел қараймыз.",

    daysLegendTitle:"Түстердің мағынасы",
    daysLegendGreen:"Жасыл: 7 күннен көп қалды", daysLegendYellow:"Сары: 3-7 күн қалды", daysLegendRed:"Қызыл: 3 күннен аз қалды, жақында аяқталады"
  },
  en: {
    siteName:"Silu",
    navHome:"Home", navFavorites:"Favorites", navProfile:"My Listings", navPost:"Post",
    heroEyebrow:"Kazakhstan · Chinese Community Platform",
    heroTitle:"Connecting the Chinese community across Kazakhstan",
    heroSub:"Roommates, rentals, jobs, business partners — one classifieds board built for the community",
    searchPlaceholder:"Search: city, role, keywords…", searchBtn:"Search",
    statListings:"listings", statCities:"cities", statCats:"categories",
    catSectionTitle:"Browse by category", allListings:"All listings", clearFilter:"Clear filter ✕",
    footerTagline:"A listings platform for the Chinese community in Kazakhstan",
    footerNote:"Fortune favors the bold",
    noResults:"No listings found", allOption:"All categories",

    favoritesTitle:"My Favorites", noFavorites:"You haven't saved any listings yet — browse the home page.",
    profileTitle:"My Listings", noMyListings:"You haven't posted any listings yet.",
    editBtn:"Edit", deleteBtn:"Delete", confirmDelete:"Delete this listing?",

    postTitleNew:"Post a new listing", postTitleEdit:"Edit listing",
    formCategory:"Category", formTitleLabel:"Title",
    formTitlePh:"e.g. 2-bedroom apartment for rent downtown", formCity:"City", formContact:"Contact",
    formContactPh:"WeChat / WhatsApp / phone", formDescription:"Description",
    uploadLabel:"Photos", uploadHint:"Up to 4 photos — click or drag & drop here",
    formCancel:"Cancel", formSubmit:"Publish", formSave:"Save changes",
    treasureFreeNotice:"This category is completely free", treasureFreeBadge:"Always free",
    recommendBtn:"Recommend +1", recommendedBtn:"Recommended", recommendCountLabel:"{n} recommendations",
    recommendSuccess:"Thanks for recommending!", recommendAlready:"You already recommended this",

    toastPosted:"Published!", toastUpdated:"Updated", toastDeleted:"Deleted",
    toastFavAdd:"Added to favorites", toastFavRemove:"Removed from favorites", toastMaxPhotos:"You can upload up to 4 photos",
    backHome:"← Back to home",
    listingNotFound:"This listing doesn't exist or has been unpublished.",
    photoCounter:"{cur} / {total}",

    navLogin:"Log in", logoutBtn:"Log out", welcomeUser:"Hi, ",
    loginTitle:"Log in", registerTitle:"Create an account",
    loginPageTitle:"Log in to Silu", registerPageTitle:"Join Silu",
    loginIntro:"Welcome back! Choose how to log in", orDivider:"or",
    phoneLoginDisabledNotice:"📮 Phone verification login is temporarily under maintenance. Please use Google login above. Sorry for the inconvenience.",
    homeBanner:"📢 Your first listing is free! Share us for 24 hours to earn another free listing",
    tabLogin:"Log in", tabRegister:"Sign up",
    formName:"Name", formPhone:"Phone / Email", formPassword:"Password", formPasswordPh:"At least 6 characters",
    submitLogin:"Log in", submitRegister:"Sign up & log in",
    noAccountYet:"Don't have an account?", alreadyHaveAccount:"Already have an account?",
    switchToRegister:"Sign up", switchToLogin:"Log in",
    errorUserExists:"This phone/email is already registered", errorInvalidLogin:"Incorrect account or password",
    errorFillAll:"Please fill in all fields",
    loginRequiredMsg:"Please log in to continue", goLogin:"Go to login",
    passwordHint:"This is a demo project — passwords are stored with basic encryption. Please don't reuse a password from another important account.",
    dateLabel:"Posted",

    statusPendingPayment:"Awaiting payment", statusPending:"Under review", statusActive:"Live",
    statusRejected:"Rejected", statusExpired:"Expired", statusHidden:"Unpublished",
    daysLeftLabel:"{n} days left", expiringSoonLabel:"Expiring soon", rejectReasonLabel:"Rejection reason",

    categoryLabel:"Category", planFree:"Free ({n} left)", planNoFree:"No free posts left",
    plan10:"10 days · 500 KZT", plan30:"30 days · 1000 KZT (recommended)",
    kaspiPayTitle:"Kaspi payment details", kaspiPayHint:"Transfer using the details below, upload a screenshot of the payment, and wait for admin confirmation before your listing goes live.",
    kaspiPhoneLabel:"Recipient phone", kaspiNameLabel:"Recipient name", uploadPaymentScreenshot:"Upload payment screenshot",
    submitToReview:"Submit for review",

    otpPhoneLabel:"Phone number", otpSendBtn:"Send code", otpResend:"Resend ({n}s)", otpCodeLabel:"Verification code",
    otpNameLabel:"Name", otpLoginBtn:"Log in / Sign up", googleLoginBtn:"Continue with Google",
    adminRegisterPageTitle:"Register as admin",
    adminInviteCodeLabel:"Admin invite code", adminLoginTitle:"Admin login", userLoginTitle:"User login",
    adminLoginIntro:"Admins only. Log in with your phone verification code", adminInviteHint:"The invite code is required every time you log in",
    goUserLogin:"I'm a regular user", goAdminLogin:"I'm an admin", devOtpHint:"Dev mode, code: {code}",

    navFeedback:"Feedback", navReferral:"Share & earn", navAdmin:"Admin panel",
    feedbackTitle:"Feedback", feedbackTypeLabel:"Type", feedbackContentLabel:"Content",
    feedbackContactLabel:"Contact (optional)", feedbackTypeBug:"Bug", feedbackTypeSuggestion:"Suggestion",
    feedbackTypeComplaint:"Complaint", feedbackTypeOther:"Other", feedbackSubmitBtn:"Submit", feedbackThanks:"Thanks for your feedback!",

    referralTitle:"🎁 Share & earn", referralCopy:"Share the site on WeChat Moments/Instagram/TikTok including the link, upload a screenshot — once approved you get 1 free listing (once per person)",
    referralRule:"Requirements: the post must include the site link and stay up for at least 24 hours, or the reward will be revoked.",
    referralUploadLabel:"Upload share screenshot (up to 2MB)", referralSubmitBtn:"Submit for review",
    referralStatusPending:"Under review", referralStatusApproved:"Approved, reward granted", referralStatusRejected:"Rejected",
    referralAlreadyGranted:"You've already claimed the referral reward", referralSubmitted:"Submitted — waiting for admin review",

    notifEmpty:"No notifications yet", notifMarkAllRead:"Mark all as read",

    adminDashTitle:"Admin panel", adminTabPayments:"Pending payments", adminTabListings:"New listings", adminTabEdited:"Edited listings",
    adminTabFeedback:"Feedback", adminTabReferrals:"Referral review",
    adminConfirmPay:"Confirm payment", adminApprove:"Approve", adminReject:"Reject",
    adminRejectReasonPh:"Rejection reason (optional)", adminNoData:"No data",
    adminTotalUsers:"Total users", adminTotalAdmins:"Admins", adminPaidBadge:"Paid", adminFreeBadge:"Free",
    adminMarkRead:"Mark as read", adminMarkResolved:"Mark as resolved",

    adminTabActive:"Live listings", adminHide:"Unpublish", adminUnhide:"Republish", adminDelete:"Delete",
    confirmHideListing:"Unpublish this listing? It will disappear from the site, but the data is kept and can be restored anytime.",
    confirmUnhideListing:"Republish this listing?",
    confirmAdminDelete:"Permanently delete this listing? This cannot be undone.",
    ipLabel:"Posted from IP",

    navDisclaimer:"Disclaimer",
    disclaimerShort:"All listings are posted by users themselves. The platform is not responsible for the accuracy of content — please verify independently before any transaction.",
    disclaimerReadMore:"Read full disclaimer →",
    disclaimerPageTitle:"Disclaimer",
    disclaimerP1:"Silu (\"the platform\") is a place where users post and browse listings themselves. All ads, job posts, rentals, secondhand items, and services are published by users. The platform only provides the technical means to publish and does not guarantee the accuracy, correctness, or legality of any content.",
    disclaimerP2:"Before contacting another user, making a deal, or sharing personal information, please verify the other party's identity and the real condition of the property/item yourself. Do not transfer money or pay a deposit until you have confirmed the information is genuine. The platform is not liable, directly or indirectly, for losses arising from inaccurate listings, disputes between users, or any other harm.",
    disclaimerP3:"All listings go through basic moderation aimed at catching legal violations and obvious fraud, but this does not confirm the accuracy of a listing's content.",
    disclaimerP4:"If you notice a false listing, a scam, or other violation, please let us know via the Feedback page and we'll look into it as soon as possible.",

    daysLegendTitle:"What the colors mean",
    daysLegendGreen:"Green: more than 7 days left", daysLegendYellow:"Yellow: 3-7 days left", daysLegendRed:"Red: 3 days or less, expiring soon"
  }
};

/* ---------- 分类 ---------- */
function iconWrap(inner){ return `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`; }
function iconDuo(){ return iconWrap('<circle cx="8" cy="8" r="3"/><circle cx="18" cy="9" r="2.6"/><path d="M3 21c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6"/><path d="M14.5 15.3c2.6.3 4.5 2.6 4.5 5.7"/>'); }
function iconHouse(){ return iconWrap('<path d="M4 12 13 4l9 8"/><path d="M6 11v9h14v-9"/><path d="M10.5 20v-5h5v5"/>'); }
function iconBriefcase(){ return iconWrap('<rect x="3.5" y="8" width="19" height="12" rx="1.5"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h5A1.5 1.5 0 0 1 17 5.5V8"/><path d="M3.5 13.5h19"/>'); }
function iconPerson(){ return iconWrap('<circle cx="13" cy="8" r="4"/><path d="M4.5 22c0-4.5 3.8-8 8.5-8s8.5 3.5 8.5 8"/>'); }
function iconHandshake(){ return iconWrap('<path d="M2.5 12 7 8l4 3 4-3 4.5 4"/><path d="M7 8 3 12l3.5 3.5L11 11"/><path d="M19 8l3.5 4-4 4-4-3"/><path d="M9.5 14 12 16.3 15 14"/>'); }
function iconTag(){ return iconWrap('<path d="M13 3 21 11l-9 9-8-8V4h8Z"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/>'); }
function iconHeart(filled){ return `<svg width="19" height="19" viewBox="0 0 24 24" fill="${filled ? 'currentColor':'none'}" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.2C.4 8.3 2 4.5 5.6 4c2.1-.3 4 .8 6.4 3.2C14.4 4.8 16.3 3.7 18.4 4c3.6.5 5.2 4.3 3.6 7.8C19.5 16.4 12 21 12 21Z"/></svg>`; }
function iconCamera(){ return `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h3l1.5-2.2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.6"/></svg>`; }
function iconTrash(){ return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/></svg>`; }
function iconUser(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7"/></svg>`; }
function iconLogout(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`; }
function iconPlus(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>`; }
function iconBell(){ return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>`; }
function iconGift(){ return iconWrap('<rect x="4" y="10" width="18" height="12" rx="1.5"/><path d="M4 10h18"/><path d="M13 10v12"/><path d="M13 10c-1.5-4-6.5-4.5-6.5-1.2 0 1.7 3 1.7 6.5 1.2Z"/><path d="M13 10c1.5-4 6.5-4.5 6.5-1.2 0 1.7-3 1.7-6.5 1.2Z"/>'); }
function iconMegaphone(){ return iconWrap('<path d="M3 10.5v5l3.5.7v-6.4L3 10.5Z"/><path d="M6.5 9.5v7.7L18 21V5L6.5 9.5Z"/><path d="M9.5 18l.5 2.5a1.6 1.6 0 0 0 3.1-.6L13 17"/>'); }
function iconMore(){ return iconWrap('<circle cx="6" cy="13" r="1.6" fill="currentColor" stroke="none"/><circle cx="13" cy="13" r="1.6" fill="currentColor" stroke="none"/><circle cx="20" cy="13" r="1.6" fill="currentColor" stroke="none"/>'); }

const categories = [
  { id:"secondhand", icon:iconTag(), color:"amber",
    name:{zh:"二手交易",ru:"Товары б/у",kk:"Қолданылған заттар",en:"Secondhand"} },
  { id:"rental", icon:iconHouse(), color:"blue",
    name:{zh:"房屋租聘",ru:"Аренда жилья",kk:"Пәтер жалдау",en:"Housing Rental"} },
  { id:"jobs", icon:iconBriefcase(), color:"indigo",
    name:{zh:"招聘求职",ru:"Работа",kk:"Жұмыс",en:"Jobs"} },
  { id:"services", icon:iconPerson(), color:"teal",
    name:{zh:"生活服务",ru:"Услуги",kk:"Қызметтер",en:"Services"} },
  { id:"treasure", icon:iconGift(), color:"rose",
    name:{zh:"私藏推荐",ru:"Личные рекомендации",kk:"Жеке ұсыныстар",en:"Local Favorites"} },
  { id:"shopads", icon:iconMegaphone(), color:"orange",
    name:{zh:"店家广告",ru:"Реклама бизнеса",kk:"Бизнес жарнамасы",en:"Business Ads"} },
  { id:"partner", icon:iconHandshake(), color:"purple",
    name:{zh:"找合作商",ru:"Бизнес-партнёры",kk:"Іскерлік серіктестер",en:"Partners"} },
  { id:"other", icon:iconMore(), color:"gray",
    name:{zh:"其他",ru:"Другое",kk:"Басқа",en:"Other"} }
];

/* ---------- 城市 ---------- */
const cities = {
  almaty:{zh:"阿拉木图",ru:"Алматы",kk:"Алматы",en:"Almaty"},
  astana:{zh:"阿斯塔纳",ru:"Астана",kk:"Астана",en:"Astana"},
  shymkent:{zh:"奇姆肯特",ru:"Шымкент",kk:"Шымкент",en:"Shymkent"},
  turkestan:{zh:"突厥斯坦",ru:"Туркестан",kk:"Түркістан",en:"Turkestan"},
  semey:{zh:"谢米伊",ru:"Семей",kk:"Семей",en:"Semey"},
  kyzylorda:{zh:"克孜勒奥尔达",ru:"Кызылорда",kk:"Қызылорда",en:"Kyzylorda"}
};

/* ========================================================
   以下为与后端 API 通信的部分（替代原来的 localStorage 存储）
   ======================================================== */

const LS_TOKEN = "kz_token";
const LS_USER_CACHE = "kz_user_cache";
const LS_LANG = "kz_lang";

function getToken(){ return localStorage.getItem(LS_TOKEN); }

function saveSession(token, user){
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_USER_CACHE, JSON.stringify(user));
}

function logoutUser(){
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER_CACHE);
}

/* 同步读取缓存的当前用户信息（用于页面即时判断是否已登录，无需等待网络） */
function getCurrentUser(){
  try{ return JSON.parse(localStorage.getItem(LS_USER_CACHE)); }
  catch(e){ return null; }
}

/* 统一的 API 请求封装：自动带上 Authorization 头，非 2xx 会抛出错误 */
async function apiFetch(pathname, options){
  options = options || {};
  options.headers = Object.assign({}, options.headers);
  const token = getToken();
  if (token) options.headers["Authorization"] = "Bearer " + token;

  let res;
  try{
    res = await fetch(API_BASE + pathname, options);
  }catch(e){
    throw new Error("无法连接服务器，请确认后端已启动，或检查 config.js 里的地址是否正确");
  }
  let data = null;
  try{ data = await res.json(); }catch(e){ /* 可能没有响应体 */ }
  if (!res.ok){
    throw new Error((data && data.error) || ("请求失败(" + res.status + ")"));
  }
  return data;
}

/* ---------- 手机验证码：请求 + 登录/注册 ---------- */
async function requestOtp(phone){
  try{
    const data = await apiFetch("/auth/otp/request", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phone })
    });
    return { ok:true, dev: data.dev, devCode: data.devCode };
  }catch(e){
    return { ok:false, error: e.message };
  }
}

async function verifyOtp(phone, code, name){
  try{
    const data = await apiFetch("/auth/otp/verify", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phone, code, name })
    });
    saveSession(data.token, data.user);
    return { ok:true, user:data.user, isNewUser:data.isNewUser };
  }catch(e){
    return { ok:false, error: e.message };
  }
}

/* ---------- 管理员：验证码登录/注册(需邀请码) ---------- */
async function requestAdminOtp(phone){
  return requestOtp(phone); // 发送验证码的接口是同一个
}
async function verifyAdminOtp(phone, code, name, inviteCode){
  try{
    const data = await apiFetch("/auth/admin/otp/verify", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ phone, code, name, inviteCode })
    });
    saveSession(data.token, data.user);
    return { ok:true, user:data.user };
  }catch(e){
    return { ok:false, error: e.message };
  }
}

/* ---------- Google 登录 ---------- */
async function loginWithGoogle(idToken){
  try{
    const data = await apiFetch("/auth/google", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ idToken })
    });
    saveSession(data.token, data.user);
    return { ok:true, user:data.user };
  }catch(e){
    return { ok:false, error: e.message };
  }
}

/* ---------- 站点公开配置(Google客户端ID / Kaspi收款信息) ---------- */
let _publicConfigCache = null;
async function fetchPublicConfig(){
  if (_publicConfigCache) return _publicConfigCache;
  try{
    _publicConfigCache = await apiFetch("/public-config", { method:"GET" });
  }catch(e){
    _publicConfigCache = { googleClientId:"", kaspiPhone:"", kaspiName:"" };
  }
  return _publicConfigCache;
}

/* ---------- 信息(listings) ---------- */
async function fetchListings(filters){
  filters = filters || {};
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.mine) params.set("mine", "true");
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  const data = await apiFetch("/listings" + (qs ? "?" + qs : ""), { method:"GET" });
  return data.listings;
}

async function fetchListing(id){
  const data = await apiFetch("/listings/" + id, { method:"GET" });
  return data.listing;
}

/* formData 由调用方构建(包含文本字段 + 最多4个 photos 文件) */
async function createListing(formData){
  const data = await apiFetch("/listings", { method:"POST", body: formData });
  return data.listing;
}
async function updateListing(id, formData){
  const data = await apiFetch("/listings/" + id, { method:"PUT", body: formData });
  return data.listing;
}
async function deleteListing(id){
  return apiFetch("/listings/" + id, { method:"DELETE" });
}
async function recommendListing(id){
  return apiFetch("/listings/" + id + "/recommend", { method:"POST" });
}

/* ---------- 收藏 ---------- */
async function fetchFavoriteIds(){
  if (!getCurrentUser()) return [];
  try{
    const data = await apiFetch("/favorites", { method:"GET" });
    return data.favoriteIds;
  }catch(e){ return []; }
}
async function addFavorite(listingId){
  return apiFetch("/favorites/" + listingId, { method:"POST" });
}
async function removeFavorite(listingId){
  return apiFetch("/favorites/" + listingId, { method:"DELETE" });
}

/* ---------- 反馈 ---------- */
async function submitFeedback(type, content, contact){
  return apiFetch("/feedback", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ type, content, contact })
  });
}
async function fetchFeedbackAdmin(status){
  const qs = status ? "?status=" + status : "";
  const data = await apiFetch("/feedback" + qs, { method:"GET" });
  return data.feedback;
}
async function updateFeedbackStatus(id, status){
  return apiFetch("/feedback/" + id + "/status", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ status })
  });
}

/* ---------- 推广奖励 ---------- */
async function submitReferral(file){
  const fd = new FormData();
  fd.append("screenshot", file);
  return apiFetch("/referrals", { method:"POST", body: fd });
}
async function fetchMyReferrals(){
  const data = await apiFetch("/referrals/mine", { method:"GET" });
  return data.submissions;
}
async function fetchReferralsAdmin(status){
  const qs = status ? "?status=" + status : "";
  const data = await apiFetch("/referrals" + qs, { method:"GET" });
  return data.submissions;
}
async function approveReferral(id){ return apiFetch("/referrals/" + id + "/approve", { method:"POST" }); }
async function rejectReferral(id){ return apiFetch("/referrals/" + id + "/reject", { method:"POST" }); }

/* ---------- 管理后台统计 ---------- */
async function fetchAdminStats(){
  return apiFetch("/admin/stats", { method:"GET" });
}

/* ---------- 广告审核(管理员) ---------- */
async function fetchAdminQueue(status, reviewType){
  let url = "/listings/admin/queue?status=" + status;
  if (reviewType) url += "&reviewType=" + reviewType;
  const data = await apiFetch(url, { method:"GET" });
  return data.listings;
}
async function confirmListingPayment(id){ return apiFetch("/listings/" + id + "/confirm-payment", { method:"POST" }); }
async function approveListing(id){ return apiFetch("/listings/" + id + "/approve", { method:"POST" }); }
async function rejectListing(id, reason){
  return apiFetch("/listings/" + id + "/reject", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ reason })
  });
}
async function hideListing(id){ return apiFetch("/listings/" + id + "/hide", { method:"POST" }); }
async function unhideListing(id){ return apiFetch("/listings/" + id + "/unhide", { method:"POST" }); }
async function adminDeleteListing(id){ return apiFetch("/listings/" + id, { method:"DELETE" }); }

/* ---------- 站内通知 ---------- */
async function fetchNotifications(){
  return apiFetch("/notifications", { method:"GET" });
}
async function markNotificationRead(id){
  return apiFetch("/notifications/" + id + "/read", { method:"POST" });
}
async function markAllNotificationsRead(){
  return apiFetch("/notifications/read-all", { method:"POST" });
}

function getLang(){ return localStorage.getItem(LS_LANG) || "zh"; }
function setLang(lang){ localStorage.setItem(LS_LANG, lang); }

/* ---------- 通用 UI ---------- */
function applyTranslations(lang){
  const t = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
    const key = el.getAttribute("data-i18n-ph");
    if (t[key]) el.setAttribute("placeholder", t[key]);
  });
  document.documentElement.lang = lang;
  document.body.className = document.body.className.replace(/\blang-\w+\b/g,"").trim();
  document.body.classList.add(lang === "zh" ? "zh" : "lang-"+lang);
}

function initLangSwitcher(onChange){
  const lang = getLang();
  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    btn.addEventListener("click", ()=>{
      const newLang = btn.getAttribute("data-lang");
      setLang(newLang);
      document.querySelectorAll(".lang-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      applyTranslations(newLang);
      if (onChange) onChange(newLang);
    });
  });
  applyTranslations(lang);
  return lang;
}

function showToast(msg){
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(()=> el.classList.remove("show"), 2200);
}

/* 标记当前页在导航栏中高亮 */
function markActiveNav(pageKey){
  document.querySelectorAll("[data-nav]").forEach(a=>{
    a.classList.toggle("active", a.getAttribute("data-nav") === pageKey);
  });
}

/* ---------- 信息卡片渲染(首页 / 收藏页 / 我的发布 共用) ---------- */
function categoryOf(catId){ return categories.find(c=>c.id===catId); }

function formatDate(iso, lang){
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const locales = { zh:"zh-CN", ru:"ru-RU", kk:"kk-KZ", en:"en-US" };
  try{ return d.toLocaleDateString(locales[lang] || "en-US", { year:"numeric", month:"short", day:"numeric" }); }
  catch(e){ return d.toISOString().slice(0,10); }
}

function daysLeftBadge(listing, lang){
  if (listing.status !== "active" || listing.daysLeft === null || listing.daysLeft === undefined) return "";
  const t = translations[lang];
  const n = listing.daysLeft;
  let cls = "days-green";
  if (n <= 3) cls = "days-red";
  else if (n <= 7) cls = "days-yellow";
  const label = n <= 3 ? t.expiringSoonLabel : t.daysLeftLabel.replace("{n}", n);
  return `<span class="days-badge ${cls}">${label}</span>`;
}

function statusBadge(listing, lang){
  const t = translations[lang];
  const map = {
    pending_payment: { cls:"status-pending", label:t.statusPendingPayment },
    pending: { cls:"status-pending", label:t.statusPending },
    active: { cls:"status-active", label:t.statusActive },
    rejected: { cls:"status-rejected", label:t.statusRejected },
    expired: { cls:"status-expired", label:t.statusExpired },
    hidden: { cls:"status-expired", label:t.statusHidden }
  };
  const info = map[listing.status];
  if (!info) return "";
  return `<span class="status-badge ${info.cls}">${info.label}</span>`;
}

/* 拒绝原因：直接显示出来，不能只靠鼠标悬停(手机上没有悬停这回事，会导致看不到) */
function rejectReasonBox(listing, lang){
  const t = translations[lang];
  if (listing.status !== "rejected" || !listing.rejectReason) return "";
  return `<div class="reject-reason-box"><strong>${t.rejectReasonLabel}：</strong>${listing.rejectReason}</div>`;
}

function photoOrPlaceholder(listing, fav, showFavorite){
  const favBtn = showFavorite === false ? "" :
    `<button class="fav-btn ${fav ? 'active':''}" data-fav-id="${listing.id}" aria-label="favorite">${iconHeart(fav)}</button>`;
  if (listing.photos && listing.photos.length){
    const extra = listing.photos.length > 1 ? `<span class="photo-count">1/${listing.photos.length}</span>` : "";
    return `<div class="listing-photo"><img src="${API_ORIGIN}${listing.photos[0]}" alt="" loading="lazy">${extra}${favBtn}</div>`;
  }
  const cat = categoryOf(listing.category);
  return `<div class="listing-photo listing-photo--placeholder">${cat ? cat.icon : ""}${favBtn}</div>`;
}

function renderListingCard(listing, lang, opts){
  opts = opts || {};
  const t = translations[lang];
  const cat = categoryOf(listing.category);
  const favoriteIds = opts.favoriteIds || [];
  const fav = favoriteIds.includes ? favoriteIds.includes(listing.id) : false;
  const cityName = cities[listing.city] ? cities[listing.city][lang] : listing.city;

  const ownerActions = opts.showOwnerActions ?
    `<div class="owner-actions">
       <a class="btn-mini" href="post.html?id=${listing.id}">${t.editBtn}</a>
       <button class="btn-mini btn-mini-danger" data-delete-id="${listing.id}">${iconTrash()} ${t.deleteBtn}</button>
     </div>` : "";

  const badges = opts.showOwnerActions ?
    `<div class="badge-row">${statusBadge(listing, lang)}${daysLeftBadge(listing, lang)}</div>` :
    (daysLeftBadge(listing, lang) ? `<div class="badge-row">${daysLeftBadge(listing, lang)}</div>` : "");

  const reasonBox = opts.showOwnerActions ? rejectReasonBox(listing, lang) : "";

  const recommendRow = listing.category === "treasure" ? `
    <div class="recommend-row">
      <button class="btn-mini ${listing.hasRecommended ? 'recommended' : ''}" data-recommend-id="${listing.id}" ${listing.hasRecommended ? 'disabled' : ''}>
        ${listing.hasRecommended ? t.recommendedBtn : t.recommendBtn}
      </button>
      <span class="recommend-count" data-recommend-count>${t.recommendCountLabel.replace("{n}", listing.recommendCount || 0)}</span>
    </div>` : "";

  return `<article class="listing-card listing-card--clickable" data-listing-id="${listing.id}">
    ${photoOrPlaceholder(listing, fav, opts.showFavorite)}
    <div class="listing-card-body">
      <span class="listing-tag">${cat ? cat.name[lang] : ""}</span>
      <h3 class="listing-title">${listing.title}</h3>
      <p class="listing-desc">${listing.desc}</p>
      ${badges}
      ${reasonBox}
      <div class="listing-meta">
        <span class="listing-city">${cityName}</span>
        <span class="listing-date">${formatDate(listing.createdAt, lang)}</span>
      </div>
      ${recommendRow}
      ${listing.category !== "treasure" ? `<div class="listing-contact-row">${t.formContact}: <span class="listing-contact">${listing.contact}</span></div>` : ""}
      ${ownerActions}
    </div>
  </article>`;
}

/* 渲染header右侧的登录状态区域(所有页面共用) */
function renderAuthArea(){
  const el = document.getElementById("authArea");
  if (!el) return;
  const lang = getLang();
  const t = translations[lang];
  const user = getCurrentUser();

  /* "管理后台"入口放进汉堡菜单的导航链接里，不再占常驻区域的位置，
     避免手机端管理员登录后被这个按钮挤到第二行 */
  const adminNavLink = document.getElementById("navAdminLink");
  if (adminNavLink) adminNavLink.hidden = !(user && user.role === "admin");

  if (user){
    el.innerHTML = `
      <div class="notif-wrap">
        <button class="icon-btn" id="notifBell" aria-label="notifications">${iconBell()}<span class="notif-dot" id="notifDot" hidden></span></button>
        <div class="notif-dropdown" id="notifDropdown" hidden>
          <div class="notif-head">
            <button class="notif-markall" id="notifMarkAll">${t.notifMarkAllRead}</button>
          </div>
          <div class="notif-list" id="notifList"><p class="notif-empty">${t.notifEmpty}</p></div>
        </div>
      </div>
      <span class="auth-hello">${t.welcomeUser}${user.name}</span>
      <button class="btn btn-ghost btn-sm" id="logoutBtn">${iconLogout()} ${t.logoutBtn}</button>`;
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.addEventListener("click", ()=>{ logoutUser(); location.href = "index.html"; });
    setupNotifications(lang);
  } else {
    el.innerHTML = `<a class="btn btn-ghost btn-sm" href="login.html">${iconUser()} ${t.navLogin}</a>`;
  }
}

/* 通知铃铛：拉取通知、渲染下拉列表、点击展开/收起、全部标记已读 */
async function setupNotifications(lang){
  const t = translations[lang];
  const bell = document.getElementById("notifBell");
  const dropdown = document.getElementById("notifDropdown");
  const dot = document.getElementById("notifDot");
  const list = document.getElementById("notifList");
  const markAllBtn = document.getElementById("notifMarkAll");
  if (!bell) return;

  try{
    const data = await fetchNotifications();
    dot.hidden = data.unreadCount === 0;
    if (data.notifications.length === 0){
      list.innerHTML = `<p class="notif-empty">${t.notifEmpty}</p>`;
    } else {
      list.innerHTML = data.notifications.map(n=>`
        <div class="notif-item ${n.is_read ? '' : 'unread'}" data-notif-id="${n.id}">
          <p>${n.message}</p>
          <span class="notif-time">${formatDate(n.created_at, lang)}</span>
        </div>`).join("");
      list.querySelectorAll("[data-notif-id]").forEach(item=>{
        item.addEventListener("click", async ()=>{
          await markNotificationRead(item.getAttribute("data-notif-id"));
          item.classList.remove("unread");
        });
      });
    }
  }catch(e){ /* 静默失败，不影响页面其它功能 */ }

  bell.addEventListener("click", (e)=>{
    e.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
    if (!dropdown.hidden){
      dropdown.style.left = "auto";
      dropdown.style.right = "0px";
      const margin = 8;
      const rect = dropdown.getBoundingClientRect();
      if (rect.left < margin){
        const shift = margin - rect.left;
        dropdown.style.right = (0 - shift) + "px";
      }
    }
  });
  document.addEventListener("click", (e)=>{
    if (!dropdown.hidden && !dropdown.contains(e.target) && e.target !== bell){
      dropdown.hidden = true;
    }
  });
  if (markAllBtn){
    markAllBtn.addEventListener("click", async ()=>{
      await markAllNotificationsRead();
      dot.hidden = true;
      list.querySelectorAll(".unread").forEach(i=>i.classList.remove("unread"));
    });
  }
}

/* 需要登录才能访问的页面：未登录则跳转到登录页，并记录来源以便登录后跳回 */
function requireAuth(currentPage){
  const user = getCurrentUser();
  if (!user){
    location.href = "login.html?redirect=" + encodeURIComponent(currentPage);
    return null;
  }
  return user;
}

/* 卡片区域内绑定收藏 / 删除 按钮的事件（事件委托，均为异步请求后端） */
function wireCardEvents(container, onChange){
  container.addEventListener("click", async (e)=>{
    const favBtn = e.target.closest("[data-fav-id]");
    if (favBtn){
      if (!getCurrentUser()){
        location.href = "login.html?redirect=" + encodeURIComponent(location.pathname.split("/").pop());
        return;
      }
      const id = favBtn.getAttribute("data-fav-id");
      const nowActive = !favBtn.classList.contains("active");
      favBtn.disabled = true;
      try{
        if (nowActive) await addFavorite(id); else await removeFavorite(id);
        showToast(nowActive ? translations[getLang()].toastFavAdd : translations[getLang()].toastFavRemove);
        if (onChange) await onChange();
      }catch(err){
        alert(err.message);
      }finally{
        favBtn.disabled = false;
      }
      return;
    }
    const recBtn = e.target.closest("[data-recommend-id]");
    if (recBtn){
      if (!getCurrentUser()){
        location.href = "login.html?redirect=" + encodeURIComponent(location.pathname.split("/").pop());
        return;
      }
      const id = recBtn.getAttribute("data-recommend-id");
      const t = translations[getLang()];
      recBtn.disabled = true;
      try{
        const result = await recommendListing(id);
        showToast(t.recommendSuccess);
        recBtn.classList.add("recommended");
        recBtn.textContent = t.recommendedBtn;
        const row = recBtn.closest(".recommend-row");
        const countEl = row ? row.querySelector("[data-recommend-count]") : null;
        if (countEl) countEl.textContent = t.recommendCountLabel.replace("{n}", result.recommendCount);
      }catch(err){
        alert(err.message);
        recBtn.disabled = false;
      }
      return;
    }
    const delBtn = e.target.closest("[data-delete-id]");
    if (delBtn){
      const id = delBtn.getAttribute("data-delete-id");
      const t = translations[getLang()];
      if (confirm(t.confirmDelete)){
        delBtn.disabled = true;
        try{
          await deleteListing(id);
          showToast(t.toastDeleted);
          if (onChange) await onChange();
        }catch(err){
          alert(err.message);
          delBtn.disabled = false;
        }
      }
      return;
    }
    if (e.target.closest(".owner-actions")) return; // 编辑/删除按钮所在区域，不触发跳转
    const card = e.target.closest("[data-listing-id]");
    if (card){
      location.href = "listing.html?id=" + encodeURIComponent(card.getAttribute("data-listing-id"));
    }
  });
}

/* ========== 移动端(<768px)汉堡菜单：所有页面自动生效，不需要在每个页面脚本里单独调用 ========== */
/* ========== 剩余天数颜色说明("?"点击展开小气泡)：首页/收藏页/我的发布页共用 ========== */
function renderDaysLegend(lang){
  const slot = document.getElementById("daysLegendSlot");
  if (!slot) return;
  const t = translations[lang];
  slot.innerHTML = `
    <span class="days-legend-wrap">
      <button type="button" class="days-legend-btn" id="daysLegendBtn" aria-label="?">?</button>
      <div class="days-legend-popover" id="daysLegendPopover" hidden>
        <strong>${t.daysLegendTitle}</strong>
        <p><span class="days-badge days-green">●</span> ${t.daysLegendGreen}</p>
        <p><span class="days-badge days-yellow">●</span> ${t.daysLegendYellow}</p>
        <p><span class="days-badge days-red">●</span> ${t.daysLegendRed}</p>
      </div>
    </span>`;
  const btn = document.getElementById("daysLegendBtn");
  const pop = document.getElementById("daysLegendPopover");
  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    pop.hidden = !pop.hidden;
    if (!pop.hidden){
      pop.style.left = "0px";
      pop.style.right = "auto";
      const margin = 8;
      const rect = pop.getBoundingClientRect();
      const overflowRight = rect.right - (window.innerWidth - margin);
      if (overflowRight > 0){
        pop.style.left = (-overflowRight) + "px";
      }
      const rect2 = pop.getBoundingClientRect();
      if (rect2.left < margin){
        pop.style.left = (parseFloat(pop.style.left) + (margin - rect2.left)) + "px";
      }
    }
  });
  document.addEventListener("click", (e)=>{
    if (!pop.hidden && !pop.contains(e.target) && e.target !== btn){
      pop.hidden = true;
    }
  });
}

function initMobileNav(){
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  function closeMenu(){
    menu.classList.remove("open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
  }
  function toggleMenu(){
    const isOpen = menu.classList.toggle("open");
    btn.classList.toggle("active", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  }

  btn.addEventListener("click", (e)=>{
    e.stopPropagation();
    toggleMenu();
  });
  /* 点导航链接后自动收起面板；语言按钮不收起，方便切换完还能接着点导航 */
  menu.querySelectorAll(".main-nav a").forEach(a=> a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e)=>{
    if (menu.classList.contains("open") && !menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)){
      closeMenu();
    }
  });
  window.addEventListener("resize", ()=>{
    if (window.innerWidth > 767) closeMenu();
  });
}
initMobileNav();
