# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# medical_ui

## Admin workspace

The admin UI is available at `/admin`. The authenticated profile returned by
`GET /api/users/profile` must include an admin role as `role: "ADMIN"`,
`roles: ["ADMIN"]`, or `authorities: ["ROLE_ADMIN"]` for the client route guard
and admin navigation to recognize the user.

The medicine admin screen uses the medicine and inventory API routes:

- `GET /api/medicines`
- `POST /api/medicines`
- `PUT /api/medicines/{id}`
- `POST /api/inventory` with `medicineId`, `availableQuantity`,
  `reservedQuantity`, and `reorderLevel`
- `POST /api/medicines/import/preview` as multipart form data with field `file`
- `POST /api/medicines/import/{importId}/commit`

Medicine and inventory writes require an `ADMIN` realm role at the gateway.
Image upload remains a UI-only optional placeholder and is not sent to the
backend yet. Medicine responses can provide `imageUrl` when image support is
implemented. The preview response includes `importId`, `rows`, and
`validCount`/`errorCount`; each row includes `rowNumber`, medicine data, and
an `errors` array. The commit response includes `importedCount` and `status`.
The UI accepts CSV, XLS, and XLSX for bulk import. The backend validates every
row and rejects commit when any row contains errors.

Medicine payloads follow the medicine service request model, including
`name`, `genericName`, `manufacturer`, `category`, `description`, `price`,
`prescriptionRequired`, `expiryDate`, and `active`. Initial stock is submitted
separately to inventory. The gateway enforces admin authorization; the client
route guard is only a navigation/UX control.

Order administration remains wired to `GET /api/admin/orders` and
`PATCH /api/admin/orders/{id}/status`; those endpoints are not part of the
medicine admin backend work.
