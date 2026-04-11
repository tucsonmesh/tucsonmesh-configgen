# Configgen: Tucson Mesh Configuration Generator

Configgen helps users configure their wireless devices to connect to Tucson Mesh. Device configuration templates live under [`/configs/`](./configs/) in this repo, grouped by device.

### Development

Ensure a recent version of Node.js is installed. This starts the Vite dev server:

```sh
cd tucsonmesh-configgen
npm install
npm run dev
```

Open the URL it prints to view the app. Changes to source or config templates hot-reload.

### Adding a config

Drop a new `.tmpl` file into `configs/<DeviceName>/`. It'll auto-appear in the dropdowns on next reload. Any `{{tagname}}` in the template becomes a form field; `{{nodenumber}}` gets range-validated and `{{psk}}` is rendered as a masked password input.