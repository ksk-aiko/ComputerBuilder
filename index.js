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

const hddList = fetch(config.url + "?type=hdd")
  .then((response) => response.json())
  .then((data) => {
    return data;
  });

const ssdList = fetch(config.url + "?type=ssd")
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
        filteredModels = sortedArray.filter((model) => {
          return model.includes(`${quantity}x`);
        });
      }

      if (filteredModels.length > 0) {
        filteredModels.forEach((model) => {
          const option = document.createElement("option");
          option.value = model;
          option.textContent = model;
          modelSelect.appendChild(option);
        });
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
      const event = new Event("change");
      ramBrand.dispatchEvent(event);
    }
  });
}

function setStorageBrand() {
  document
    .getElementById("storageType")
    .addEventListener("change", function () {
      document.getElementById("storage").value = ""; // Clear previous storage input
      document.getElementById("storageModel").innerHTML = ""; // Clear previous model options
      document.getElementById("storageBrand").innerHTML = ""; // Clear previous options
      const storageType = document.getElementById("storageType").value;
      if (storageType == "hdd") {
        // Get brand name from hddList
        const brands = hddList.then((hdds) => {
          return hdds.map((hdd) => hdd.Brand);
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
        const select = document.getElementById("storageBrand");
        sortedBrands.then((sortedArray) => {
          sortedArray.forEach((brand) => {
            const option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
          });
        });
      } else if (storageType == "ssd") {
        // Get brand name from ssdList
        const brands = ssdList.then((ssds) => {
          return ssds.map((ssd) => ssd.Brand);
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
        const select = document.getElementById("storageBrand");
        sortedBrands.then((sortedArray) => {
          sortedArray.forEach((brand) => {
            const option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
          });
        });
      }
    });
}

function setStorageModel() {
  document
    .getElementById("storageBrand")
    .addEventListener("change", function () {
      const select = document.getElementById("storageBrand");
      const brand = select.value;
      const storageType = document.getElementById("storageType").value;
      const storage = document.getElementById("storage").value;

      let modelsPromise;
      if (storageType === "hdd") {
        modelsPromise = hddList.then((hdds) => {
          return hdds
            .filter((hdd) => hdd.Brand === brand)
            .map((hdd) => hdd.Model);
        });
      } else if (storageType === "ssd") {
        modelsPromise = ssdList.then((ssds) => {
          return ssds
            .filter((ssd) => ssd.Brand === brand)
            .map((ssd) => ssd.Model);
        });
      }

      // Eliminate duplicates
      const uniqueModels = modelsPromise.then((modelArray) => {
        return [...new Set(modelArray)];
      });
      // Sort models alphabetically
      const sortedModels = uniqueModels.then((uniqueArray) => {
        return uniqueArray.sort();
      });

      sortedModels.then((sortedArray) => {
        let filteredModels = sortedArray;
        if (storage) {
          filteredModels = sortedArray.filter((model) => {
            return model.includes(storage);
          });
        }

        if (filteredModels.length > 0) {
          // selectタグ内にoptionを追加
          const modelSelect = document.getElementById("storageModel");
          modelSelect.innerHTML = ""; // Clear previous options
            filteredModels.forEach((model) => {
              const option = document.createElement("option");
              option.value = model;
              option.textContent = model;
              modelSelect.appendChild(option);
            });
        } else {
          // If no models match, add a default option
          const modelSelect = document.getElementById("storageModel");
          modelSelect.innerHTML = ""; // Clear previous options
          const defaultOption = document.createElement("option");
          defaultOption.value = "";
          defaultOption.textContent = "No models available for this brand";
          modelSelect.appendChild(defaultOption);
        }
      });
    });
}

function updateModelsByStorage() {
  document.getElementById("storage").addEventListener("change", function () {
    document.getElementById("storageModel").innerHTML = ""; // Clear previous options
    const storageBrand = document.getElementById("storageBrand");
    if (storageBrand.value) {
      const event = new Event("change");
      storageBrand.dispatchEvent(event);
    }
  });
}

function main() {
  setCPUBrand();
  setCPUModel();
  setGPUBrand();
  setGPUModel();
  setRAMBrand();
  setRAMModel();
  updateModelsByQuantity();
  setStorageBrand();
  setStorageModel();
  updateModelsByStorage();
}

// Call the main function to execute the code
main();
