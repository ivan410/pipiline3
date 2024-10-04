const { Bot, InlineKeyboard } = require('grammy');

// Создаем бота
const bot = new Bot('7775667277:AAGLQsvb549Xyeqq01YVjmZsstNZ5jMoEo8');

// Стейт для отслеживания вопросов
const userStates = {};

// Обработчик команды /start
bot.command('start', async (ctx) => {
  await ctx.reply('Приветствую, это Бот | BugBounty\n' +
    'Наша команда специализируется на тестировании криптовалют и их сетей, обеспечивая их безопасность и надежность.\n' +
    'Прежде чем мы начнём знакомство, Бот задаст вам пару вопросов:\n' +
    'Готовы начать?',
    {
      reply_markup: new InlineKeyboard().text('да', 'start_yes'),
    });
});

// Обработчик нажатия на inline-кнопку "да"
bot.callbackQuery('start_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  userStates[chatId] = { step: 1 }; // Начинаем с первого вопроса
  await ctx.reply('Вам исполнилось 18 лет?', {
    reply_markup: new InlineKeyboard()
      .text('Да', 'age_yes')
      .text('Нет', 'age_no'),
  });
  await ctx.answerCallbackQuery(); // Убираем загрузку с inline-кнопки
});

// Обработчик для кнопки ответа на вопрос о возрасте
bot.callbackQuery('age_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  userStates[chatId].step = 2;
  await ctx.reply('Как к вам можно обращаться?', {
    reply_markup: { remove_keyboard: true }, // Убираем клавиатуру для ввода имени
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('age_no', async (ctx) => {
  await ctx.reply('Очень рады были бы поработать с вами, но к сожалению мы не сотрудничаем с несовершеннолетними пользователями.');
  await ctx.answerCallbackQuery();
  delete userStates[ctx.chat.id]; // Завершаем диалог
});

// Обработка имени пользователя
bot.on('message:text', async (ctx) => {
  const chatId = ctx.chat.id;
  const state = userStates[chatId];

  if (state && state.step === 2) {
    userStates[chatId].name = ctx.message.text; // Сохраняем имя
    userStates[chatId].step = 3;
    await ctx.reply(`Рады знакомству, ${ctx.message.text}`);
    await ctx.reply('Был ли у вас опыт работы с тестированием блокчейн-технологий или криптовалютами?', {
      reply_markup: new InlineKeyboard()
        .text('Да', 'exp_yes')
        .text('Нет', 'exp_no'),
    });
  }
});

// Обработка ответа на вопрос об опыте
bot.callbackQuery('exp_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  userStates[chatId].step = 4;
  await ctx.reply('Готовы ли вы уделять проекту до 1 часу в день?', {
    reply_markup: new InlineKeyboard()
      .text('Да', 'hour_yes')
      .text('Нет', 'hour_no'),
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('exp_no', async (ctx) => {
  const chatId = ctx.chat.id;
  await ctx.reply('Не волнуйтесь, наша команда будет рядом на каждом этапе - мы поможем разобраться во всех нюансах и шаг за шагом приведём вас к первому заработку.');
  userStates[chatId].step = 4;
  await ctx.reply('Готовы ли вы уделять проекту до 1 часа в день?', {
    reply_markup: new InlineKeyboard()
      .text('Да', 'hour_yes')
      .text('Нет', 'hour_no'),
  });
  await ctx.answerCallbackQuery();
});

// Обработка вопросов об участии в проекте
bot.callbackQuery('hour_yes', async (ctx) => {
  const chatId = ctx.chat.id;
  userStates[chatId].step = 5;
  await ctx.reply('Готовы ли вы учавствовать в индивидуальных и групповых аудио конференциях (20-30 мин)?', {
    reply_markup: new InlineKeyboard()
      .text('Да', 'conf_yes')
      .text('Нет', 'conf_no'),
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery('hour_no', async (ctx) => {
  await ctx.reply('Очень жаль! Если измените своё решение, мы всегда на связи.');
  await ctx.answerCallbackQuery();
  delete userStates[ctx.chat.id]; // Завершаем диалог
});

// Завершающий вопрос
bot.callbackQuery('conf_yes', async (ctx) => {
  await ctx.reply('Благодарим вас за все ваши ответы!');
  const inlineKeyboard = new InlineKeyboard().url('Написать нам', 'https://t.me/bel0v_mx');
  await ctx.reply('Готовы начать погружение в мир криптовалют и зарабатывать на новых возможностях уже сегодня? Напишите нам прямо сейчас, и мы поможем вам сделать первые шаги!', {
    reply_markup: inlineKeyboard,
  });
  await ctx.answerCallbackQuery();
  delete userStates[ctx.chat.id]; // Завершаем диалог
});

bot.callbackQuery('conf_no', async (ctx) => {
  await ctx.reply('Очень жаль! Если измените своё решение, мы всегда на связи.');
  await ctx.answerCallbackQuery();
  delete userStates[ctx.chat.id]; // Завершаем диалог
});

// Запуск бота
bot.start();
