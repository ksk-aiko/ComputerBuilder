class PCBuilder {
  constructor(apiUrl) {
    // basic settings
    this.apiUrl = apiUrl;
    this.componentsTypes = ["cpu", "gpu", "ram", "hdd", "ssd"];
    this.componentsData = {}; // to store fetched components data
    this.selectedParts = {}; // to store selected components

    // object for cache of DOM elements
    this.elements = {};

    // initialize the app
    this.init();
  }

  async init() {
    try {
      await this.fetchAllComponentsData();

      this.cacheElements();

      this.setupEventListeners();

      this.setupInitialUI();
    } catch (error) {
      console.error("Error initializing PCBuilder:", error);
      this.displayError(
        "Failed to initialize the PC Builder. Please try again later."
      );
    }
  }

  // fetch all components data from the API
  async fetchAllComponentsData(type) {
    const fetchPromises = this.componentsTypes.map((type) =>
      this.fetchComponentsData(type)
    );
    await Promise.all(fetchPromises);
  }

  // fetch components data for a specific type
  async fetchComponentsData(type) {
    try {
      const response = await fetch(`${this.apiUrl}?type=${type}`);
      if (!response.ok) {
        throw new Error(
          `${type}data fetch failed with status ${response.status}`
        );
      }
      const data = await response.json();
      this.componentsData[type] = data;
      return data;
    } catch (error) {
      console.error("Error fetching components data:", error);
      throw error;
    }
  }

  // cache DOM elements for performance
  cacheElements() {
    // General Elements
    const ids = [
      "cpuBrand",
      "cpuModel",
      "gpuBrand",
      "gpuModel",
      "howMany",
      "ramBrand",
      "ramModel",
      "storageType",
      "storageSize",
      "storageBrand",
      "storageModel",
      "addPCButton",
      "pcList",
    ];

    ids.forEach((id) => {
      this.elements[id] = document.getElementById(id);
    });
  }

  // setup all event listeners
  setupEventListeners() {
    // select CPU Brand
    this.elements.cpuBrand.addEventListener("change", () => {
      this.updateModels(
        "cpu",
        this.elements.cpuBrand.value,
        this.elements.cpuModel
      );
    });

    // select GPU Brand
    this.elements.gpuBrand.addEventListener("change", () => {
      this.updateModels(
        "gpu",
        this.elements.gpuBrand.value,
        this.elements.gpuModel
      );
    });

    // select RAM Brand
    this.elements.ramBrand.addEventListener("change", () => {
      this.updateRAMModels();
    });

    // select RAM Quantity
    this.elements.howMany.addEventListener("change", () => {
      if (this.elements.ramBrand.value) {
        this.updateRAMModels();
      }
    });
    // select Storage Type
    this.elements.storageType.addEventListener("change", () => {
      const storageType = this.elements.storageType.value;
      this.updateStorageCapacities(storageType);
      this.updateBrands(storageType, this.elements.storageBrand);

      // Reset the storage model when type changes
      this.elements.storageSize.value = "";
      this.elements.storageBrand.value = "";
      this.elements.storageModel.innerHTML = "";
    });

    // select Storage Brand
    this.elements.storageBrand.addEventListener("change", () => {
      this.updateStorageModels();
    });

    // select Storage Size
    this.elements.storageSize.addEventListener("change", () => {
      this.updateStorageModels();
    });

    // Add PC Button
    this.elements.addPCButton.addEventListener("click", () => {
      this.addPC();
    });
  }

  // setup initial UI state
  setupInitialUI() {
    // display CPU brands
    this.updateBrands("cpu", this.elements.cpuBrand);

    // display GPU brands
    this.updateBrands("gpu", this.elements.gpuBrand);

    // display RAM brands
    this.updateBrands("ram", this.elements.ramBrand);

    // set RAM quantity options
    this.setupQuantityOptions();

    // set storage type options
    this.setupStorageTypeOptions();
  }

  // Generic brand update method
  updateBrands(type, selectElement) {
    const componentType = type === "hdd" || type === "ssd" ? type : type;
    const items = this.componentsData[componentType] || [];

    // Extract brand list
    const brands = [...new Set(items.map(item => item.Brand))].sort();

    // Clear existing options
    selectElement.innerHTML = "";

    // Add default option
    this.addDefaultOption(selectElement, `Select ${type.toUpperCase()} Brand`);

    brands.forEach((brand) => {
      this.addOption(selectElement, brand, brand);
    });
  }

  // Generic model update method
  updateModels(type, brand, selectElement) {
    if (!brand) return;

    const items = this.componentsData[type] || [];

    // Filter items by brand
    const models = [
      ...new Set(
        items.filter((item) => item.Brand === brand).map((item) => item.Model)
      )
    ].sort();

    // Clear existing options
    selectElement.innerHTML = "";

    // Add default option
    this.addDefaultOption(selectElement, `Select ${type.toUpperCase()} Model`);

    if (models.length > 0) {

      models.forEach((model) => {

        this.addOption(selectElement, model, model);

        selectElement.addEventListener('change', () => {
          const selectedItem = items.find(item => item.Model === model && item.Brand === brand);

          this.selectedParts[type] = selectedItem;
        })
      });


    } else {
      this.addOption(
        selectElement,
        "",
        "No models available for this brand",
        true
      );
    }
  }

  // Generic RAM model update method
  updateRAMModels() {
    const brand = this.elements.ramBrand.value;
    const quantity = this.elements.howMany.value;

    if (!brand) return;

    const items = this.componentsData["ram"] || [];

    let models = [
      ...new Set(
        items.filter((item) => item.Brand === brand).map((item) => item.Model)
      ),
    ].sort();

    if (quantity) {
      const filteredModels = models.filter((model) =>
        model.includes(`${quantity}x`)
      );

      if (filteredModels.length > 0) {
        models = filteredModels;
      }
    }

    this.elements.ramModel.innerHTML = "";

    this.addDefaultOption(this.elements.ramModel, "Select RAM Model");

    if (models.length > 0) {
      models.forEach((model) => {
        this.addOption(this.elements.ramModel, model, model);
        this.elements.ramModel.addEventListener('change', () => {
          const selectedItem = items.find(item => item.Model === model && item.Brand === brand);

          this.selectedParts.ram = selectedItem;
        });
      });
    } else {
      this.addOption(
        this.elements.ramModel,
        "",
        "No models available for this brand and quantity",
        true
      );
    }
  }

  updateStorageCapacities(storageType) {
    const capacities =
      storageType === "hdd"
        ? ["500GB", "1TB", "2TB", "4TB"]
        : ["128GB", "256GB", "512GB", "1TB", "2TB"];

    this.elements.storageSize.innerHTML = "";

    this.addDefaultOption(this.elements.storageSize, "Select Storage Size");

    capacities.forEach((capacity) => {
      this.addOption(this.elements.storageSize, capacity, capacity);
    });
  }

  updateStorageModels() {
    const storageType = this.elements.storageType.value;
    const brand = this.elements.storageBrand.value;
    const capacity = this.elements.storageSize.value;

    if (!brand || !storageType) return;

    const items = this.componentsData[storageType] || [];

    let models = [
      ...new Set(
        items.filter((item) => item.Brand === brand).map((item) => item.Model)
      ),
    ].sort();

    if (capacity) {
      const filteredModels = models.filter((model) => {
        model.includes(capacity);
      });

      if (filteredModels.length > 0) {
        models = filteredModels;
      }
    }

    this.elements.storageModel.innerHTML = "";

    this.addDefaultOption(this.elements.storageModel, "Select Storage Model");

    if (models.length > 0) {
      models.forEach((model) => {
        this.addOption(this.elements.storageModel, model, model);
        this.elements.storageModel.addEventListener('change', () => {
          const selectedItem = items.find(item => item.Model === model && item.Brand === brand);

          this.selectedParts.storage = selectedItem;
        });
      });
    } else {
      this.addOption(
        this.elements.storageModel,
        "",
        "No models available for this brand and capacity",
        true
      );
    }
  }

  setupQuantityOptions() {
    this.elements.howMany.innerHTML = "";

    this.addDefaultOption(this.elements.howMany, "Select RAM Quantity");

    for (let i = 1; i <= 8; i++) {
      this.addOption(this.elements.howMany, i, i);
    }
  }

  setupStorageTypeOptions() {
    this.elements.storageType.innerHTML = "";

    this.addDefaultOption(this.elements.storageType, "Select Storage Type");

    this.addOption(this.elements.storageType, "hdd", "HDD");
    this.addOption(this.elements.storageType, "ssd", "SSD");
  }

  addDefaultOption(selectElement, text) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = text;
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    selectElement.appendChild(option);
  }

  addOption(selectElement, value, text, disabled = false) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    if (disabled) option.disabled = true;
    selectElement.appendChild(option);
  }

  displayError(message) {
    const container = document.querySelector(".container");
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger");
    errorDiv.textContent = message;
    container.insertBefore(errorDiv, container.firstChild);
  }

  addPC() {
    console.log(this.selectedParts)
    const PC = this.assemblePC();
    this.setPCUI(PC);
  }

  assemblePC() {
    const cpuModel = this.selectedParts.cpu.Model;
    const gpuModel = this.selectedParts.gpu.Model;
    const ramModel = this.selectedParts.ram.Model;
    const storageModel = this.selectedParts.storage.Model;

    return {
      'cpu': cpuModel,
      'gpu': gpuModel,
      'ram': ramModel,
      'storage': storageModel,
    }

  }

  setPCUI(PC){

    this.elements.pcList.innerHTML = ''; // Clear existing PC list

    if (!this.elements.pcList) return;
    
    const vritualPC = document.createElement('div');
    // Draw a virtual PC
    vritualPC.classList.add('card', 'mb-3', 'shadow');
    vritualPC.innerHTML = `
      <div class="card-header bg-dark text-light d-flex justify-content-between align-items-center">
      <span>Virtual PC</span>
      <div>
        <span class="badge rounded-circle bg-danger mx-1">&nbsp;</span>
        <span class="badge rounded-circle bg-warning mx-1">&nbsp;</span>
        <span class="badge rounded-circle bg-success mx-1">&nbsp;</span>
      </div>
      </div>

      <div class="card-body bg-light">
      <div class="terminal-style p-3 bg-dark text-light rounded mb-3">
        <p class="mb-2"><span class="text-success">></span> <strong>CPU:</strong> ${PC.cpu}</p>
        <p class="mb-2"><span class="text-success">></span> <strong>GPU:</strong> ${PC.gpu}</p>
        <p class="mb-2"><span class="text-success">></span> <strong>RAM:</strong> ${PC.ram}</p>
        <p class="mb-0"><span class="text-success">></span> <strong>Storage:</strong> ${PC.storage}</p>
      </div>

      <div class="benchmark p-3 bg-dark text-warning rounded">
        <div class="gaming-benchmark">
        <p class="mb-2"><span class="text-success">></span> <strong>Gaming Benchmark:</strong> ${this.calculateBenchmarkForGaming()}%</p>
        </div>
        <div class="work-benchmark">
        <p class="mb-0"><span class="text-success">></span> <strong>Working Benchmark:</strong> ${this.calculateBenchmarkForWork()}%</p>
        </div>
      </div>
      </div>
    `;
    
    // Append to PC list
    this.elements.pcList.appendChild(vritualPC);

  }
  // TODO: Implement the benchmark calculation logic
  calculateBenchmarkForGaming() {
    const cpuWeight = 0.25;
    const gpuWeight = 0.6;
    const ramWeight = 0.125;
    const storageWeight = 0.025;

    const cpuScore = this.selectedParts.cpu ? this.selectedParts.cpu.Benchmark * cpuWeight : 0;
    const gpuScore = this.selectedParts.gpu ? this.selectedParts.gpu.Benchmark * gpuWeight : 0;
    const ramScore = this.selectedParts.ram ? this.selectedParts.ram.Benchmark * ramWeight : 0;
    const storageScore = this.selectedParts.storage ? this.selectedParts.storage.Benchmark * storageWeight : 0;

    const totalScore = cpuScore + gpuScore + ramScore + storageScore;

    return totalScore.toFixed(2);
  }

  calculateBenchmarkForWork() {
    const cpuWeight = 0.6;
    const gpuWeight = 0.25;
    const ramWeight = 0.1;
    const storageWeight = 0.05;

    const cpuScore = this.selectedParts.cpu ? this.selectedParts.cpu.Benchmark * cpuWeight : 0;
    const gpuScore = this.selectedParts.gpu ? this.selectedParts.gpu.Benchmark * gpuWeight : 0;
    const ramScore = this.selectedParts.ram ? this.selectedParts.ram.Benchmark * ramWeight : 0;
    const storageScore = this.selectedParts.storage ? this.selectedParts.storage.Benchmark * storageWeight : 0;

    const totalScore = cpuScore + gpuScore + ramScore + storageScore;

    return totalScore.toFixed(2);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.recursionist.io/builder/computers';
    const pcBuilder = new PCBuilder(apiUrl);

})
