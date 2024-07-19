const { exec } = require("child_process");

const components = [
  "avatar",
  "alert-dialog",
  "skeleton",
  "button",
  "card",
  "input",
  "badge",
  "tooltip",
  "dropdown-menu",
  "popover",
  "toast",
  "command",
];

components.forEach((component) => {
  exec(`npx shadcn-ui@latest add ${component}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error installing ${component}:`, stderr);
      return;
    }
    console.log(`Installed ${component}:`, stdout);
  });
});
