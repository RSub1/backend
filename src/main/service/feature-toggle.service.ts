import { Injectable } from 'skeidjs';

@Injectable()
export class FeatureToggleService {

    private activeToggles: Array<Feature>;

    constructor() {
        this.activeToggles = [];
    }

    switchToggle( toggle: Feature, isActive: boolean ) {
        if (isActive) {
            this.activeToggles.push(toggle);
        } else {
            this.activeToggles = this.activeToggles.filter(t => t.name !== toggle.name);
        }
    }
}


export type FeatureName = 'ANONYMOUS_IDS';

function isFeatureName(something: unknown): something is FeatureName {
    return something === 'ANONYMOUS_IDS';
}

export class Feature {
    name: FeatureName;

    private constructor(name: FeatureName) {
        this.name = name;
    }

    static of(name: string): Feature | never {
        if (isFeatureName(name)) {
            return new Feature(name);
        }
        else throw new TypeError(`'${name} is no valid feature'`);
    }
}


