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

    isActive( toggle: Feature ): boolean {
        return !!this.activeToggles.filter(t => t.name === toggle.name).length;
    }
}


export type FeatureName = 'ANONYMOUS_IDS' | 'INDEX_HTML';

function isFeatureName(something: unknown): something is FeatureName {
    return something === 'ANONYMOUS_IDS'
        || something === 'INDEX_HTML';
}

export class Feature {
    name: FeatureName;

    private constructor(name: FeatureName) {
        this.name = name;
    }

    static of(name: string | FeatureName): Feature | never {
        if (isFeatureName(name)) {
            return new Feature(name);
        }
        else throw new TypeError(`'${name} is no valid feature'`);
    }
}


