# Agent Guidelines — qoz-vision-prod-web

Правила для работы с этим проектом. Дополняют корневой [`AGENTS.md`](../AGENTS.md).

## 1. Design system

- **Единственный источник цветов:** [`styles.md`](./styles.md) (палитра из ТЗ Алатау)
- **Не копировать** `beef-web/styles.md` — там другая (зелёная) палитра
- Цепочка синхронизации: `styles.md` → `app/globals.css` → `lib/brand/tokens.ts` → компоненты
- В `components/**/*.tsx` **запрещён** хардкод hex и tailwind-цветов (`green-500`, `#0B5CFF`, …)
- Использовать `lib/brand/ui-classes.ts` и semantic CSS variables

## 2. Strict typing

- TypeScript везде, без `any`
- Типы бренда: `lib/brand/*.ts` — exported interfaces/types
- `lib/brand/*` — **без JSX** (только константы, маппинги, copy)

## 3. Component architecture

- UI на **shadcn/ui** (`components/ui/*`), адаптированный через design tokens
- **Запрещено дублировать** компоненты: не создавать `AdmMetricCard`, `AdmAlertRow`, `AdmModuleHeader`
- Расширять существующие shells: `summary-card-shell`, `metric-feature-shell`, `director-alert-row`, `director-header`
- Файлы < 1000 строк
- Presentation / business logic / API — раздельно

## 4. Anti-laziness

- Полные реализации, без `// ...existing code` и TODO-заглушек
- Единый `AdmLoadingScreen` вместо `<p>Загрузка…</p>`
- UI copy — только из `lib/brand/copy.ts`

## 5. Business logic — не трогать без задачи

- `lib/data/*`, `lib/cameras/*`, `lib/incidents-*`, `app/api/**`
- `lib/hierarchy/school-context.tsx` — логика выбора школы
- Internal ids: `qoz_vision`, API paths

## 6. Fallbacks

- Без stub-данных и workaround без явного ОК заказчика
- Корпус в шапке — скрыт до API

## 7. Visual precision

- Card: `12px` radius, `1px` border `#E3E9F2` (ТЗ §8)
- Spacing: шкала 8px (8 / 16 / 24 / 32 / 48)
- Статусы алертов: цвет + текстовый label (ТЗ §6)

## 8. Чеклист перед PR

- [ ] Цвет менялся в `styles.md` первым
- [ ] Нет новых дублирующих `Adm*` компонентов
- [ ] `lib/brand/*` typed, без JSX
- [ ] hooks/repos/API не затронуты
- [ ] `rg "green-500|#0B5CFF" components/` — 0 новых нарушений

План внедрения: [`../ТЗ-Алатау-gap-и-план.md`](../ТЗ-Алатау-gap-и-план.md)
