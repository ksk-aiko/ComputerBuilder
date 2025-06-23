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
    async fetchComponentsData(type) {
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
    chcheElements() {
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

}
}