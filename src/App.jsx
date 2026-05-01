import React, { useState } from "react";
import Mustache from "mustache";
import qs from "qs";

import Options from "./components/Options";
import Tags from "./components/Tags";
import Script from "./components/Script";
import InfoText from "./components/InfoText";

import { devices } from "./configs";

function App() {
  const params = qs.parse(window.location.search.replace("?", ""));

  const initialDevice =
    devices.find((d) => d.name === params.device) || devices[0];
  const initialTemplate =
    initialDevice.templates.find((t) => t.name === params.template) ||
    initialDevice.templates[0];

  const [selectedDevice, setSelectedDevice] = useState(initialDevice);
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);
  const [tagValues, setTagValues] = useState({});

  const tags = selectedTemplate
    ? Mustache.parse(selectedTemplate.content).reduce(
        (acc, i) =>
          !acc.includes(i[1]) && i[0] === "name" ? acc.concat(i[1]) : acc,
        []
      )
    : null;

  const onDeviceSelected = (device) => {
    const firstTemplate = device.templates[0];
    setSelectedDevice(device);
    setSelectedTemplate(firstTemplate);
    setQuery({ device: device.name, template: firstTemplate?.name });
  };

  const onTemplateSelected = (template) => {
    setSelectedTemplate(template);
    setQuery({ device: selectedDevice.name, template: template.name });
  };

  const onTagChange = (key, value) => {
    setTagValues({ ...tagValues, [key]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    downloadConfig(selectedTemplate, tagValues);
  };

  return (
    <div className="vh-100-l flex flex-row-l flex-column f5">
      <div className="bg-near-white measure-l w-100 pa4 unselectable br b--light-gray">
        <form className="flex flex-column items-end" onSubmit={onSubmit}>
          <Options
            devices={devices}
            templates={selectedDevice?.templates}
            selectedDevice={selectedDevice}
            selectedTemplate={selectedTemplate}
            onDeviceSelected={onDeviceSelected}
            onTemplateSelected={onTemplateSelected}
          />
          <Tags tags={tags} tagValues={tagValues} onChange={onTagChange} />
          {selectedDevice && selectedTemplate && (
            <input
              type="submit"
              value="Download config"
              className="mt3 pa2 pointer"
            />
          )}
        </form>
        {selectedDevice && selectedTemplate && <InfoText />}
      </div>
      <div className="w-100 h-100 overflow-y-scroll">
        <Script template={selectedTemplate} tagValues={tagValues} />
      </div>
    </div>
  );
}

export default App;

function setQuery(params) {
  window.history.replaceState(
    null,
    null,
    window.location.pathname + "?" + qs.stringify(params)
  );
}

function downloadConfig(template, tags) {
  if (!template || !tags) return null;

  const { name, content } = template;
  const fileName = name
    ? name.replace("nnnn", tags.nodenumber).replace(".tmpl", "")
    : "config.txt";
  const configText = Mustache.render(content, tags);
  var blob = new Blob([configText], {
    type: "text/csv;charset=utf8;", // Why csv??
  });

  var element = document.createElement("a");
  document.body.appendChild(element);
  element.setAttribute("href", window.URL.createObjectURL(blob));
  element.setAttribute("download", fileName);
  element.style.display = "";
  element.click();
  document.body.removeChild(element);
}
