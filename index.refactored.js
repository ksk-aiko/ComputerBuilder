class PCBuilder {
    constructor(apiUrl) {
        // basic settings
        this.apiUrl = apiUrl;
        this.componentsTypes = ['cpu', 'gpu', 'ram', 'hdd', 'ssd'];
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
            console.error('Error initializing PCBuilder:', error);
            this.displayError('Failed to initialize the PC Builder. Please try again later.');
        }
    }

    // fetch all components data from the API
    async fetchComponentsData(type) {
        const fetchPromises = this.componentsTypes.map(type => this.fetchComponentsData(type))
        await Promise.all(fetchPromises)
    }
    
    // fetch components data for a specific type
    async fetchAllComponentsData(type) {
        try {
            const response = await fetch(`${this.apiUrl}?type=${type}`);
            if (!response.ok) {
                throw new Error(`${type}data fetch failed with status ${response.status}`);
            }
            const data = await response.json();
            this.componentsData[type] = data;
            return data;
        } catch (error) {
            console.error('Error fetching components data:', error);
            throw error;
        }
    }

    // cache DOM elements for performance
    cacheElements() {
        // General Elements
        const ids = [
            'cpuBrand', 'cpuModel',
            'gpuBrand', 'gpuModel',
            'howMany', 'ramBrand', 'ramModel',
            'storageType', 'storageSize', 'storageBrand', 'storageModel',
            'addPCButton', 'pcList'
        ];

        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    // setup all event listeners
    setupEventListeners() {
        // select CPU Brand
        this.elements.cpuBrand.addEventListener('change', () => {
            this.updateModels('cpu', this.elements.cpuBrand.value, this.elements.cpuModel);
        })

        // select GPU Brand
        this.elements.gpuBrand.addEventListener('change', () => {
            this.updateModels('gpu', this.elements.gpuBrand.value, this.elements.gpuModel);
        })

        // select RAM Brand
        this.elements.ramBrand.addEventListener('change', () => {
            this.updateModels();
        })

        // select RAM Quantity
        this.elements.howMany.addEventListener('change', () => {
            if (this.elements.ramBrand.value) {
                this.updateModels();
            }
    });
        // select Storage Type
        this.elements.storageType.addEventListener('change', () => {
            const storageType = this.elements.storage.value;
            this.updateStorageCapacities(storageType);
            this.updateBrand(storageType, this.elements.storageBrand);

            // Reset the storage model when type changes
            this.elements.storageSize.value = '';
            this.elements.storageBrand.value = '';
            this.elements.storageModel.innerHTML = '';
        });

        // select Storage Brand
        this.elements.storageBrand.addEventListener('change', () => {
            this.updateStorageModels();
        });

        // select Storage Size
        this.elements.storageSize.addEventListener('change', () => {
            this.updateStorageModels();
        });

        // Add PC Button
        this.elements.addPCButton.addEventListener('click', () => {
            this.addPCToList();
        });
    }

    // setup initial UI state
    setupInitialUI() {
        // display CPU brands
        this.updateBrands('cpu', this.elements.cpuBrand);

        // display GPU brands
        this.updateBrands('gpu', this.elements.gpuBrand);

        // display RAM brands
        this.updateBrands('ram', this.elements.ramBrand);

        // set RAM quantity options
        this.setupQuantityOptions();

        // set storage type options
        this.setupStorageTypeOptions();

    }

    // Generic brand update method
    updateBrands(type, selectElement) {
        
        const componentType = (type === 'hdd' || type === 'ssd') ? type :type;
        const items = this.componentsData[componentType] || [];

        // Extract brand list
        const brands = [...new Set(items.map(item => item.brand)).sort()];

        // Clear existing options
        selectElement.innerHTML = '';

        // Add default option
        this.addDefaultOption(selectElement, `Select ${type.toUpperCase()} Brand`);

        brands.forEach(brand => {
            this.addOption(selectElement, brand, brand);
        });
    }

    // Generic model update method
    updateModels(type, brand, selectElement) {
        if (!brand) return;

        const items = this.componentsData[type] || [];

        // Filter items by brand
        const models = [...new Set(
            items
                .filter(item => item.Brand === brand)
                .map(item => item.Model)
        ).sort()];

        // Clear existing options
        selectElement.innerHTML = '';

        // Add default option
        this.addDefaultOption(selectElement, `Select ${type.toUpperCase()} Model`);

        if (models.length > 0) {
            models.forEach(model => {
                this.addOption(selectElement, model, model);
            })
        } else {
            this.addOption(selectElement, '', 'No models available for this brand', true);
        }


    }

    // Generic RAM model update method
    updateRAMModels() {
        const brand = this.elements.ramBrand.value;
        const quantity = this.elements.howMany.value;

        if (!brand) return;

        const items = this.componentsData['ram'] || [];

        let models = [...new Set(
            items
                .fileter(item => item.Brand === brand)
                .map(item => item.Model)
        )].sort();

        if (quantity) {
            const filteredModels = models.filter(model => 
                model.includes(`${quantity}x`)
             );

             if (filteredModels.length > 0) {
                models = filteredModels;
             }
        }

        this.elements.ramModel.innerHTML = '';

        this.addDefaultOption(this.elements.ramModel, 'Select RAM Model');

        if (models.length > 0) {
            models.forEach(model => {
                this.addOption(this.elements.ramModel, model, model);
            });
        } else {
            this.addOption(this.elements.ramModel, '', 'No models available for this brand and quantity', true);
        }

        }
    }

