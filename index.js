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
  // Get brand name from ramList
  const brands = ramList.then((rams) => {
    return rams.map((ram) => ram.Brand);
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
  const select = document.getElementById("ramBrand");
  sortedBrands.then((sortedArray) => {
    sortedArray.forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      select.appendChild(option);
    });
  });
}


function setRAMModel() {
  document.getElementById("ramBrand").addEventListener("change", function () {
    const select = document.getElementById("ramBrand");
    const brand = select.value;
    const quantity = document.getElementById("howMany").value;

    // Get models for the selected brand
    const models = ramList.then((rams) => {
      return rams.filter((ram) => ram.Brand === brand).map((ram) => ram.Model);
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
    const modelSelect = document.getElementById("ramModel");
    modelSelect.innerHTML = ""; // Clear previous options
    sortedModels.then((sortedArray) => {
      let filteredModels = sortedArray;

      if (quantity) {
        filteredModels = sortedArray.filter(model => {
          return model.includes(`${quantity}x`);
        })
      }

      if (filteredModels.length > 0) {
        filteredModels.forEach((model) => {
          const option = document.createElement("option");
          option.value = model;
          option.textContent = model;
          modelSelect.appendChild(option);
        })
      } else {
        // If no models match, add a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "No models available for this brand";
        modelSelect.appendChild(defaultOption);
      }

    });
  });
}

function updateModelsByQuantity() {
  document.getElementById("howMany").addEventListener("change", function () {
    const ramBrand = document.getElementById("ramBrand");
    if (ramBrand.value) {
      const event = new Event('change');
      ramBrand.dispatchEvent(event);
    }
  
})
}



function main() {
  setCPUBrand();
  setCPUModel();
  setGPUBrand();
  setGPUModel();
  setRAMBrand();
  setRAMModel();
  updateModelsByQuantity();
}

// Call the main function to execute the code
main();
