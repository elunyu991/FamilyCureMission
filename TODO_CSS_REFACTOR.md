# TODO: CSS modular refactor

## Step 1: Setup files
- [ ] Create `css/` folder and page/component files

## Step 2: Split CSS
- [ ] Move base/global styles (variables, reset, typography, container, buttons)
- [ ] Move shared components (navbar, hero, generic section styles)
- [ ] Move page-specific styles into `css/pages/*.css`

## Step 3: Update entrypoint
- [ ] Replace `styles.css` content with `@import` statements pointing to new files

## Step 4: Dedupe (optional, safe)
- [ ] Identify duplicated selectors caused by multiple definitions
- [ ] Keep final intended rule and remove older duplicates

## Step 5: Verification
- [ ] Manually check key pages: index, services, health-services, contact, team

