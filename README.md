# EasyDMARC SPF Record Generator — E2E Test Suite

Automated end-to-end tests for SPF Record Generator Tool built with Playwright and JavaScript.

## Project Structure

```
├── fixtures/                          # Playwright fixtures for dependency injection
│   └── page-fixtures.js               # Registers page objects as test fixtures
├── pages/                             # Page Object Model
│   ├── BasePage.js                    # Shared actions
│   └── SpfRecordGeneratorPage.js      # SPF generator locators and actions
├── test-data/                         # Test data (mechanisms, policies, expected outputs)
│   └── spf-record-generator.data.js
├── tests/                             # Test specifications
│   ├── generate-spf-with-single-include.spec.js
│   ├── generate-spf-with-multiple-mechanisms.spec.js
│   └── generate-spf-with-redirect.spec.js
├── utils/
│   └── helpers.js                     # generateRandomDomain
├── .github/workflows/
│   └── playwright.yml                 # CI pipeline (GitHub Actions)
└── playwright.config.js               # Browser config, timeouts, environment setup
```

## Test Scenarios

| Spec | Flow | What it covers |
|------|------|----------------|
| Single Include | Basic SPF generation | Domain input → include mechanism → SoftFail policy → generate → verify output |
| Multiple Mechanisms | Complex SPF generation | Domain → 2 includes, A, MX, Exists mechanisms → Fail policy → generate → verify all mechanisms in output |
| Redirect | Redirect SPF generation | Domain → enable redirect toggle → fill redirect value → generate → verify redirect in output, no policy suffix |

Each test verifies input placeholders, form state, mechanism visibility, and generated SPF record structure.

## Setup

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
npx playwright install --with-deps
```

### Environment

Create a `.env` file (see `.env.example`):

```
BASE_URL=<application URL>
SPF_GENERATOR_PATH=<path to SPF generator page>
```

## Running Tests

```bash
# Run all tests
npm run test:ui

# Run a specific spec
npx playwright test generate-spf-with-redirect

# Run on a specific browser
npx playwright test --project=chromium

# Run with visible browser
npx playwright test --headed

# Open HTML report
npx playwright show-report
```

## Browsers

Tests run on **Chromium**, **Firefox**, and **WebKit** (configured in `playwright.config.js`).

- **Local:** parallel workers, no retries
- **CI:** 1 worker, 2 retries, HTML report uploaded as artifact

## Key Design Decisions

- **Page Object Model with fixture injection** — each page object is registered as a Playwright fixture, keeping tests clean and page instantiation automatic.
- **Test data separated from test logic** — mechanism names, values, placeholders, and expected outputs live in `test-data/` files, not in specs.
- **Dynamic test data** — domain names are randomly generated per test run to avoid collisions during parallel execution.

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push and PR to `main`. It installs dependencies and browsers, runs all tests, and uploads the HTML report as an artifact (14-day retention). Environment variables are configured via GitHub repository variables.

## SPF Record Generator Test Suite

SPF Record Generator Test Suite Structure with Test Cases