import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-vehicule-type-selector',
  templateUrl: './vehicule-type-selector.component.html',
  styleUrl: './vehicule-type-selector.component.css'
})
export class VehiculeTypeSelectorComponent implements OnInit {

  @Input() vehiculeFilters: string[] = []
  vehiculeType = ""
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal'
  @Input() id = ""
  @Input() joinable = false
  @Input() isDisabled = false

  @Output() selectedVehiculeType = new EventEmitter<string>()

  ngOnInit(): void {
    if (this.vehiculeFilters.length == 0) {
      this.vehiculeType = ""
    }

    if (this.vehiculeFilters.length == 1) {
      this.vehiculeType = this.vehiculeFilters[0]
    }

    if (this.vehiculeFilters.length > 1) {
      this.vehiculeType = "mix"
    }
  }

  onVehiculeDropdownChanged(event: any, value: string) {

    if (event.target.checked) {
      this.vehiculeFilters.push(value)

    } else {
      this.vehiculeFilters = this.vehiculeFilters.filter((item) => { return item != value })

    }

    if (this.vehiculeFilters.length == 0) {
      this.vehiculeType = ""
    }
    if (this.vehiculeFilters.length == 1) {
      this.vehiculeType = this.vehiculeFilters[0]
    }
    if (this.vehiculeFilters.length > 1) {
      this.vehiculeType = "mix"
    }
    if (this.joinable) {
      this.selectedVehiculeType.emit(this.vehiculeFilters.map((item) => item.toUpperCase()).join(','))
    } else {
      this.selectedVehiculeType.emit(this.vehiculeType)
    }

  }

  setVehicleType(vehicleType: string) {
    if (!vehicleType) return
    const vehicleTypeLowerCased = vehicleType.toLowerCase()
    if (vehicleTypeLowerCased == 'mix') {
      this.vehiculeFilters.push('taxi');
      this.vehiculeFilters.push('bus');
    } else {
      if (vehicleTypeLowerCased == '') return;
      this.vehiculeFilters.push(vehicleTypeLowerCased);
    }

  }

  clear() {
    this.vehiculeFilters = []
    this.vehiculeType = ""
  }

}
