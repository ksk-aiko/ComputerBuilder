const config = {
  url: "https://api.recursionist.io/builder/computers",
};

const cpuList = fetch(config.url + "?type=cpu")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

const gpuList = fetch(config.url + "?type=gpu")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

const ramList = fetch(config.url + "?type=ram")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

function setCPUBrand() {
  // Get brand name from cpuList
  const brands = cpuList.then((cpus) => {
    return cpus.map((cpu) => cpu.Brand);
  });
  // Eliminate duplicates
  const uniqueBrands = brands.then((brandArray) => {
    return [...new Set(brandArray)];
  });
  // Sort brands alphabetically
  const sortedBrands = uniqueBrands.then((uniqueArray) => {
    return uniqueArray.sort();
  });
  // selectタグ内にoptionを追加
  const select = document.getElementById("cpuBrand");
  sortedBrands.then((sortedArray) => {
    sortedArray.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      select.appendChild(option);
    });
  });
}

function setCPUModel() {
  document.getElementById("cpuBrand").addEventListener("change", function () {
    const select = document.getElementById("cpuBrand");
    const brand = select.value;
    // Get models for the selected brand
    const models = cpuList.then((cpus) => {
      return cpus.filter((cpu) => cpu.Brand === brand).map((cpu) => cpu.Model);
    });
    // Eliminate duplicates
    const uniqueModels = models.then((modelArray) => {
      return [...new Set(modelArray)];
    });
    // Sort models alphabetically
    const sortedModels = uniqueModels.then((uniqueArray) => {
      return uniqueArray.sort();
    });
    // selectタグ内にoptionを追加
    const modelSelect = document.getElementById("cpuModel");
    modelSelect.innerHTML = ""; // Clear previous options
    sortedModels.then((sortedArray) => {
      sortedArray.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    });
  });
}

function setGPUBrand() {
  // Get brand name from gpuList
  const brands = gpuList.then((gpus) => {
    return gpus.map((gpu) => gpu.Brand);
  });
  // Eliminate duplicates
  const uniqueBrands = brands.then((brandArray) => {
    return [...new Set(brandArray)];
  });
  // Sort brands alphabetically
  const sortedBrands = uniqueBrands.then((uniqueArray) => {
    return uniqueArray.sort();
  });
  // add option in select tag
  const select = document.getElementById("gpuBrand");
  sortedBrands.then((sortedArray) => {
    sortedArray.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      select.appendChild(option);
    });
  });
}

function setGPUModel() {
  document.getElementById("gpuBrand").addEventListener("change", function () {
    const select = document.getElementById("gpuBrand");
    const brand = select.value;
    // Get models for the selected brand
    const models = gpuList.then((gpus) => {
      return gpus.filter((gpu) => gpu.Brand === brand).map((gpu) => gpu.Model);
    });
    // Eliminate duplicates
    const uniqueModels = models.then((modelArray) => {
      return [...new Set(modelArray)];
    });
    // Sort models alphabetically
    const sortedModels = uniqueModels.then((uniqueArray) => {
      return uniqueArray.sort();
    });
    // selectタグ内にoptionを追加
    const modelSelect = document.getElementById("gpuModel");
    modelSelect.innerHTML = ""; // Clear previous options
    sortedModels.then((sortedArray) => {
      sortedArray.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    });
  });
}

function setRAMBrand() {

}

function setRAMModel() {

}

function updateModelsByQuantity() {
    
}


function main() {
  setCPUBrand();
  setCPUModel();
  setGPUBrand();
  setGPUModel();
}

// Call the main function to execute the code
main();
