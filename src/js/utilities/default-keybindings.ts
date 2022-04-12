import {DateTime, Unit} from "../datetime";
import ActionTypes from "./action-types";

function lastDateOrNew() {
    return (this.dates.lastPicked || new DateTime().setLocale(
        this.optionsStore.options.localization.locale
    )).clone;
}

function manipulateAndSet(value: number, unit: Unit) {
    const d = lastDateOrNew.call(this);
    d.manipulate(value, unit);
    this.dates.setValue(d, this.dates.lastPickedIndex);
}

export const defaultKeybindings: { [key: string]: () => boolean } = {
    ArrowUp: function () {
        if (!this.display.widget) {
            return false;
        }

        if (this.optionsStore.currentView === 'clock') {
            manipulateAndSet.call(this, this.optionsStore.options.stepping, Unit.minutes);
        } else {
            manipulateAndSet.call(this, -7, Unit.date);
        }
        return true;
    },
    ArrowDown: function () {
        if (!this.display.isVisible) {
            this.display.show();
            return false;
        }

        if (this.optionsStore.currentView === 'clock') {
            manipulateAndSet.call(this,this.optionsStore.options.stepping * -1, Unit.minutes);
        } else {
            manipulateAndSet.call(this,7, Unit.date);
        }

        return true;
    },
    'Control ArrowUp': function () {
        if (!this.display.widget) {
            return false;
        }
        
        if (this.optionsStore.currentView === 'clock') {
            manipulateAndSet.call(this,this.optionsStore.options.stepping, Unit.hours);
        } else {
            manipulateAndSet.call(this,-1, Unit.year);
        }
        
        return true;
    },
    'Control ArrowDown': function () {
        if (!this.display.widget) {
            return false;
        }
        
        if (this.optionsStore.currentView === 'clock') {
            manipulateAndSet.call(this,this.optionsStore.options.stepping * -1, Unit.hours);
        } else {
            manipulateAndSet.call(this,1, Unit.year);
        }
        
        return true;
    },
    ArrowLeft: function () {
        if (!this.display.widget) {
            return false;
        }
        
        if (this.optionsStore.currentView !== 'clock') {
            manipulateAndSet.call(this, -1, Unit.date);
        }
        
        return true;
    },
    ArrowRight: function () {
        if (!this.display.widget) {
            return false;
        }

        if (this.optionsStore.currentView !== 'clock') {
            manipulateAndSet.call(this, 1, Unit.date);
        }
        
        return true;
    },
    PageUp: function () {
        if (!this.display.widget) {
            return false;
        }

        if (this.optionsStore.currentView !== 'clock') {
            manipulateAndSet.call(this, -1, Unit.month);
        }
        
        return true;
    },
    PageDown: function () {
        if (!this.display.widget) {
            return false;
        }

        if (this.optionsStore.currentView !== 'clock') {
            manipulateAndSet.call(this, 1, Unit.month);
        }
        
        return true;
    },
    Enter: function () {
        if (!this.display.widget) {
            return false;
        }
        this.display.hide();
        return true;
    },
    Escape: function () {
        if (!this.display.widget) {
            return false;
        }
        this.display.hide();
        return true;
    },
    'Control Space': function () {
        if (!this.display.widget) {
            return false;
        }
        if (this.optionsStore.currentView === 'clock') {
            this._eventEmitters.action.emit({ e: undefined, action: ActionTypes.toggleMeridiem})
        }
        return true;
    },
    t: function () {
        if (!this.display.widget) {
            return false;
        }

        this.dates.setValue(new DateTime(), this.dates.lastPickedIndex);

        return true;
    },
    Delete: function () {
        if (!this.display.widget) {
            return false;
        }

        this.dates.clear();
        return true;
    }
}
