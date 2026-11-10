# VSEE — план структуры

Источник: Figma `eF73m5GNdh8YhbHqhMsRKi` (Page 1). Стек: pnpm + Turborepo, Next.js App Router, shadcn/ui + Tailwind, TanStack Query, react-hook-form + zod, NestJS + Prisma + PostgreSQL.

Рынок: Бишкек, валюта **сом (KGS)**, локаль `ru-KG`, телефон `+996`. Тема только **тёмная**.

Таб-бар (как в макете): **Главная · Мои события · Поиск · Корзина · Профиль**.
Уведомления — колокольчик в шапке. Избранное — пункт в профиле.

## Корень монорепо

```
vsee/
├─ apps/
│  ├─ web/                 # Next.js
│  └─ api/                 # NestJS
├─ packages/
│  ├─ shared/              # zod-схемы, enums, DTO-типы
│  ├─ api-client/          # сгенерированный из OpenAPI клиент (orval)
│  ├─ config/              # eslint, tsconfig, tailwind preset (токены из Figma)
│  └─ etl/                 # миграция из Bubble
├─ docker-compose.yml      # postgres, redis
├─ turbo.json
└─ pnpm-workspace.yaml
```

## apps/web

```
apps/web/
├─ src/proxy.ts                        # (Next 16: бывший middleware.ts) guard: my-events, cart, profile, favorites, notifications → /login
├─ components.json
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                    # providers, шрифты Inter/Roboto, <Toaster/>, class="dark"
│  │  ├─ providers.tsx                 # QueryClientProvider
│  │  ├─ not-found.tsx
│  │  ├─ error.tsx
│  │  ├─ globals.css                   # CSS vars shadcn ← токены Figma (dark only)
│  │  │
│  │  ├─ (auth)/                       # только email
│  │  │  ├─ layout.tsx                 # без tab-bar, кнопка «Назад»
│  │  │  ├─ login/page.tsx                    # Вход (+ состояние «неверный пароль»)
│  │  │  ├─ register/page.tsx                 # Регистрация: email → «Далее»
│  │  │  ├─ register/verify/page.tsx          # Код из письма (InputOTP, «Отправить повторно»)
│  │  │  ├─ forgot-password/page.tsx          # email
│  │  │  ├─ forgot-password/verify/page.tsx   # код из письма
│  │  │  └─ reset-password/page.tsx           # новый пароль
│  │  │
│  │  └─ (main)/
│  │     ├─ layout.tsx                 # AppShell: header (город, колокольчик) + BottomNav + OfflineBanner
│  │     ├─ page.tsx                   # Главная: баннер, поиск, категории, «Рекомендуемые»
│  │     ├─ search/page.tsx            # таб «Поиск»: ?q=, «Рядом с Вами», пустой результат
│  │     │
│  │     ├─ restaurants/
│  │     │  ├─ page.tsx                # список «Еда» + «Рядом с Вами»
│  │     │  ├─ map/page.tsx
│  │     │  └─ [slug]/
│  │     │     ├─ layout.tsx           # VenueHeader, акция, галерея, Tabs, FavoriteButton
│  │     │     ├─ page.tsx             # Информация
│  │     │     ├─ menu/page.tsx        # категории → product sheet (модификаторы, «Вам может понравиться»)
│  │     │     ├─ reviews/page.tsx     # список + форма на странице
│  │     │     ├─ contacts/page.tsx    # часы, адрес, маршрут
│  │     │     └─ booking/page.tsx     # один экран: гости → схема зала → дата → время → сводка
│  │     │
│  │     ├─ salons/
│  │     │  ├─ page.tsx                # список «Услуги» + «Рядом с Вами»
│  │     │  ├─ map/page.tsx
│  │     │  └─ [slug]/
│  │     │     ├─ layout.tsx
│  │     │     ├─ page.tsx             # Информация
│  │     │     ├─ services/page.tsx    # категории услуг (кол-во процедур)
│  │     │     ├─ reviews/page.tsx
│  │     │     ├─ contacts/page.tsx
│  │     │     └─ booking/page.tsx     # услуги (чекбоксы, итого) → мастер + дата + время → сводка
│  │     │
│  │     ├─ my-events/
│  │     │  ├─ page.tsx                # таб «Мои события» = мои брони; пусто: «Здесь ничего нет»
│  │     │  └─ [id]/page.tsx           # детали брони: статус, QR, отмена, поддержка
│  │     ├─ cart/page.tsx              # группы по заведению; пустое состояние; checkout disabled
│  │     ├─ notifications/page.tsx     # из колокольчика
│  │     ├─ favorites/page.tsx         # из профиля; фильтр по типу заведения
│  │     └─ profile/
│  │        ├─ page.tsx                # аватар, имя, «Изменить», меню
│  │        ├─ edit/page.tsx
│  │        └─ settings/page.tsx       # смена пароля, выход
│  │
│  ├─ components/
│  │  ├─ ui/                           # shadcn (CLI)
│  │  │  # button input input-otp form label textarea checkbox
│  │  │  # tabs card badge avatar skeleton separator scroll-area
│  │  │  # dialog drawer calendar carousel sonner
│  │  ├─ layout/
│  │  │  ├─ app-shell.tsx
│  │  │  ├─ app-header.tsx             # логотип, город, колокольчик(badge)
│  │  │  ├─ bottom-nav.tsx             # Главная / Мои события / Поиск / Корзина(badge) / Профиль
│  │  │  ├─ page-header.tsx            # заголовок + «Назад»
│  │  │  └─ offline-banner.tsx
│  │  └─ common/
│  │     ├─ search-bar.tsx             # debounce → searchParams
│  │     ├─ empty-state.tsx
│  │     ├─ price.tsx                  # «345 сом»
│  │     ├─ qty-stepper.tsx
│  │     ├─ rating-stars.tsx
│  │     ├─ rating-input.tsx
│  │     └─ infinite-list.tsx
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ api.ts                     # useLogin, useRegister, useVerifyCode, useForgot, useReset
│  │  │  ├─ components/                # login-form register-form otp-form forgot-form reset-form
│  │  │  └─ session.ts
│  │  ├─ venues/
│  │  │  ├─ api.ts                     # useVenues(search), useVenue(slug)
│  │  │  └─ components/
│  │  │     ├─ venue-card.tsx          # рейтинг, расстояние, сердечко
│  │  │     ├─ venue-list.tsx
│  │  │     ├─ venue-header.tsx
│  │  │     ├─ venue-promo.tsx         # плашка акции
│  │  │     ├─ venue-tabs.tsx
│  │  │     ├─ venue-gallery.tsx
│  │  │     ├─ venue-contacts.tsx
│  │  │     ├─ venue-map.tsx           # dynamic import, ssr:false
│  │  │     └─ route-button.tsx        # deep link 2GIS / Яндекс / Google
│  │  ├─ restaurants/
│  │  │  ├─ api.ts                     # useMenu(venueId), useHall(venueId)
│  │  │  └─ components/
│  │  │     ├─ menu-categories.tsx     # chips «Все/Пицца/…» + scrollspy
│  │  │     ├─ product-card.tsx
│  │  │     ├─ product-sheet.tsx       # модификаторы, qty, «Вам может понравиться»
│  │  │     ├─ hall-scheme.tsx         # столы по x/y, зоны, занятые
│  │  │     └─ table-booking-form.tsx
│  │  ├─ salons/
│  │  │  ├─ api.ts                     # useServices, useMasters
│  │  │  └─ components/
│  │  │     ├─ service-categories.tsx
│  │  │     ├─ service-checklist.tsx   # чекбоксы + «Итого»
│  │  │     ├─ master-picker.tsx
│  │  │     └─ salon-booking-form.tsx
│  │  ├─ booking/
│  │  │  ├─ api.ts                     # useAvailability, useCreateBooking, useMyBookings, useCancelBooking
│  │  │  └─ components/
│  │  │     ├─ month-calendar.tsx      # shadcn calendar
│  │  │     ├─ slot-grid.tsx
│  │  │     ├─ guests-counter.tsx
│  │  │     ├─ booking-summary.tsx     # «Информация о заказе»
│  │  │     ├─ booking-success-dialog.tsx
│  │  │     ├─ booking-card.tsx        # для «Мои события»: статус-бейдж
│  │  │     └─ booking-details.tsx     # QR, отмена
│  │  ├─ cart/
│  │  │  ├─ api.ts
│  │  │  └─ components/                # cart-venue-group cart-item-row cart-summary add-to-cart-button
│  │  ├─ reviews/
│  │  │  ├─ api.ts
│  │  │  └─ components/                # review-summary review-list review-card review-form
│  │  ├─ favorites/
│  │  │  ├─ api.ts                     # optimistic toggle
│  │  │  └─ components/favorite-button.tsx
│  │  ├─ notifications/
│  │  │  ├─ api.ts                     # list, markRead, unreadCount
│  │  │  ├─ use-notifications-stream.ts
│  │  │  └─ components/notification-item.tsx
│  │  └─ profile/
│  │     ├─ api.ts
│  │     └─ components/                # profile-card profile-menu profile-form avatar-upload
│  │
│  ├─ lib/
│  │  ├─ api.ts                        # fetch-обёртка, refresh token
│  │  ├─ query-keys.ts
│  │  ├─ maps.ts                       # buildRouteUrl(provider, lat, lng)
│  │  ├─ format.ts                     # даты, цены (сом), ru-KG
│  │  └─ utils.ts                      # cn()
│  ├─ hooks/                           # use-debounce, use-online, use-media-query
│  └─ messages/ru.json
└─ tests/e2e/                          # Playwright: auth, restaurant-flow, salon-flow, cart, my-events
```

## apps/api

```
apps/api/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/                      # + raw SQL: pg_trgm, btree_gist EXCLUDE
│  └─ seed.ts
├─ src/
│  ├─ main.ts                          # Swagger → openapi.json → packages/api-client
│  ├─ app.module.ts
│  ├─ common/                          # guards, decorators, zod pipe, exception filter, pagination
│  ├─ prisma/prisma.service.ts
│  ├─ infra/
│  │  ├─ queue/                        # BullMQ: notifications, email
│  │  ├─ mail/                         # коды подтверждения
│  │  └─ storage/                      # S3 presigned upload
│  └─ modules/
│     ├─ auth/          # POST /auth/register, /auth/register/verify, /auth/login,
│     │                 #      /auth/refresh, /auth/logout, /auth/password/forgot,
│     │                 #      /auth/password/verify, /auth/password/reset
│     ├─ users/         # GET|PATCH /me, POST /me/avatar
│     ├─ venues/        # GET /venues?type=&q=&city=&bbox=&near=, GET /venues/:slug
│     ├─ catalog/       # GET /venues/:id/menu, GET /products/:id/related
│     ├─ halls/         # GET /venues/:id/hall (залы, столы с координатами)
│     ├─ salons/        # GET /venues/:id/services, /venues/:id/masters?serviceIds=
│     ├─ bookings/      # GET /venues/:id/availability?type=&date=&guests=&serviceIds=&masterId=
│     │                 # POST /venues/:id/bookings, GET /me/bookings, GET /me/bookings/:id,
│     │                 # PATCH /bookings/:id/cancel
│     ├─ cart/          # GET /cart, POST /cart/items, PATCH|DELETE /cart/items/:id,
│     │                 # DELETE /cart, POST /cart/checkout → 501
│     ├─ reviews/       # GET|POST /venues/:id/reviews (+ summary: avg, count)
│     ├─ favorites/     # GET /me/favorites?type=, PUT|DELETE /me/favorites/:venueId
│     └─ notifications/ # GET /me/notifications, PATCH /:id/read, GET /me/notifications/stream (SSE)
└─ test/                # e2e (Testcontainers): booking-race, cart, auth
```

## packages/shared

```
packages/shared/src/
├─ enums.ts          # VenueType, Currency(KGS), BookingType, BookingStatus, NotificationType
├─ schemas/          # auth venue menu hall salon booking cart review profile
└─ index.ts
```

## Соответствие блоков Figma маршрутам

| Блок | Web | API |
|---|---|---|
| Вход | `(auth)/login` | `auth` |
| Регистрация + код | `(auth)/register`, `register/verify` | `auth` + `VerificationCode` |
| Восстановление пароля | `forgot-password` → `verify` → `reset-password` | `auth` |
| main | `(main)/page.tsx`, `search` | `venues` |
| Рестораны | `restaurants/**` | `venues`, `catalog`, `halls`, `bookings`, `cart`, `reviews` |
| Салоны | `salons/**` | `venues`, `salons`, `bookings`, `cart`, `reviews` |
| Корзина | `cart` | `cart` |
| События | `my-events/**` (= мои брони) | `bookings` |
| Уведомления | `notifications` | `notifications` (SSE) |
| Избранное | `favorites` | `favorites` |
| Профиль | `profile/**` | `users` |

## Решения

- **Слой features.** `app/` только собирает страницы. Ресторан и салон делят `features/venues`, отличаются вкладками и booking-флоу.
- **Таб-бар как в макете.** Уведомления открываются из шапки, избранное — из профиля.
- **«Мои события» = брони пользователя.** Отдельного модуля `events` нет.
- **Auth только по email.** SMS-провайдера нет.
- **Бронь → корзина.** Бронь создаёт `Booking(PENDING)` и `CartItem` со ссылкой на неё. Бесплатная бронь подтверждается сразу.
- **Бронь — один экран, не wizard.** Ресторан: гости → схема зала → дата → время. Салон: услуги → мастер → дата → время. Затем сводка и диалог успеха.
- **Детали товара — в sheet.** Drawer на мобильных, Dialog на десктопе.
- **Карта.** Отдельная страница `map/` с dynamic import, маршрут — deep link'ом.
- **Prisma-модели:** `Favorite(userId, venueId) @@id`, `Notification`, `VerificationCode(email, code, purpose, expiresAt, attempts)`, `RefreshToken`, `Hall(venueId, name)`, `Table(hallId, number, seats, zone, x, y)`, `Venue.promo` (текст + период).

## Токены (packages/config → globals.css)

```css
--background: #181A1B;
--background-deep: #0F1112;
--card: #303335;
--primary: #EB7126;
--foreground: #EBEEFF;
--destructive: #FF4D66;
--error-text: #FF8686;
--shadow-card: 0 1px 3px #00000012;
/* Inter 14/400 inputs, 14/500 body; Roboto 14/20 sub copy; фрейм 393px */
```

## Вне плана (в макете есть, не делаем)

Онбординг · Афиша · Кино · Цветы/Магазины · Стать партнёром · Мои карты · Мои адреса · Финансы · Поддержка/О нас/Правила · кнопка «Поделиться».

**После MVP:** доставка и оформление заказа в корзине (адрес, промокод, время доставки, оплата картой). До этого `POST /cart/checkout` → 501, кнопка disabled.
