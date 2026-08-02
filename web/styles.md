# Design System — Almaty Digital Mektebi (ТЗ Алатау)

Единственный источник hex-значений для `qoz-vision-prod-web`.  
Синхронизация: `styles.md` → `app/globals.css` → `lib/brand/tokens.ts`.

Источник требований: [`../ТЗ для Алатау.md`](../ТЗ%20для%20Алатау.md)

---

## 1. Colors

| Token | Hex | CSS variable | Usage |
| :--- | :--- | :--- | :--- |
| primary | `#0B5CFF` | `--primary` | кнопки, активные вкладки, фильтры, ссылки, выбранные строки, active icons |
| primary-foreground | `#FFFFFF` | `--primary-foreground` | текст на primary |
| background | `#F7F9FC` | `--background` | фон страницы |
| foreground | `#101828` | `--foreground` | основной текст |
| heading | `#0F1F4D` | `--heading` | заголовки h1–h3 |
| card | `#FFFFFF` | `--card` | фон карточек |
| card-foreground | `#101828` | `--card-foreground` | текст в карточках |
| muted-foreground | `#667085` | `--muted-foreground` | вторичный текст |
| border | `#E3E9F2` | `--border` | границы, dividers |
| input | `#E3E9F2` | `--input` | поля ввода |
| ring | `#0B5CFF` | `--ring` | focus ring |
| destructive | `#F04438` | `--destructive` | критические действия |
| status-success | `#22A06B` | `--status-success` | алерт: норма |
| status-success-muted | `#EAF8F1` | `--status-success-muted` | фон норма |
| status-warning | `#F79009` | `--status-warning` | алерт: внимание |
| status-warning-muted | `#FFF4E5` | `--status-warning-muted` | фон внимание |
| status-critical | `#F04438` | `--status-critical` | алерт: критический |
| status-critical-muted | `#FFF0EE` | `--status-critical-muted` | фон критический |
| status-info | `#2F80ED` | `--status-info` | алерт: информация |
| status-info-muted | `#F4F8FF` | `--status-info-muted` | фон информация |

### Chart palette (ТЗ §9)

| Token | Hex | CSS variable |
| :--- | :--- | :--- |
| chart-1 | `#0B5CFF` | `--chart-1` |
| chart-2 | `#2F80ED` | `--chart-2` |
| chart-3 | `#14B8A6` | `--chart-3` |
| chart-4 | `#7A5AF8` | `--chart-4` |
| chart-5 | `#F79009` | `--chart-5` |
| chart-6 | `#F04438` | — (TS: `ADM_CHART_COLORS.accentCritical`) |

---

## 2. Radius

| Element | Value | Tailwind |
| :--- | :--- | :--- |
| Base `--radius` | `12px` (`0.75rem`) | — |
| Card | `12px` | `rounded-lg` |
| Button / Input | `8px` | `rounded-md` |
| Badge | full | `rounded-full` |

---

## 3. Spacing (base 8px)

`8` · `16` · `24` · `32` · `48` px

---

## 4. Components

### Card (ТЗ §8)

```
background: var(--card);       /* #FFFFFF */
border: 1px solid var(--border); /* #E3E9F2 */
border-radius: 12px;
```

Импорт классов: `admCardClass`, `admCardInteractiveClass` из `lib/brand/ui-classes.ts`.

### Button

- `default`: `bg-primary text-primary-foreground`
- `outline`: `border-border`, hover `border-primary/40`

### Alert status

Цвета **только** через `--status-*` tokens. Обязателен текстовый label (не только цвет).

### Typography

- Заголовки: `text-heading` или `text-[var(--heading)]` через token
- Body: `text-foreground`
- Caption: `text-muted-foreground`

---

## 5. Brand copy

Все UI-строки — `lib/brand/copy.ts`. Не хардкодить в компонентах.

---

## 6. Правило изменений

1. Менять hex **сначала** в этом файле  
2. Синхронизировать `app/globals.css`  
3. Синхронизировать `lib/brand/tokens.ts`  
4. В компонентах — только CSS vars и `ui-classes.ts`

Запрещено: `green-500`, `sky-500`, `#0B5CFF` в `components/**/*.tsx`.
