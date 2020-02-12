import { log, find_state_data, sleep, get_diff_time } from '../util';
import { village, player } from '../gamedata';
import { Ivillage, Ibuilding_queue, Iresources, Iplayer, Ibuilding_collection, Ibuilding } from '../interfaces';
import api from '../api';
import logger from '../logger';
import uniqid from 'uniqid';
import { Ifeature, feature_single, Ioptions, Iresponse } from './feature';
import { buildings, troops_type } from '../data';


class unit_builder extends feature_single {
	// building_queue_ident: string = 'BuildingQueue:';

	options: Ioptions;

	set_default_options(): void {
		this.options = {
			uuid: uniqid.time(),
			run: false,
			error: false
		};
	}

	set_params(): void {
		this.params = {
			ident: 'build_unit',
			name: 'Unit Builder'
		};
	}

	get_description(): string {
		return 'Build unit constantly';
	}

	set_options(options: Ioptions): void {
		const { run, error, uuid } = options;
		this.options = {
			...this.options,
			uuid,
			run,
			error
		};

	}

	get_options(): Ioptions {
		return { ...this.options };
	}

	update(options: Ioptions): Iresponse {
		return {
			error: false,
			data: null,
			message: ''
		};
	}

	async run(): Promise<void> {
		logger.info(`building units: ${this.options.uuid} started`, 'Units builder');


		const villages = await village.get_own();
		const data = find_state_data(village.own_villages_ident, villages);

		interface paramObj {
			villageId: number;
			villageName: String; 
			locationId: number;
			stableId: number;
		}
		let params: paramObj[] = [];
		
		log(params);
		for(let villageObj of data) {
			let village_id = villageObj.data.villageId;
			let village_name = villageObj.data.name;
			let location_id;
			let stable_id;

			const queue_ident: string = village.building_collection_ident + village_id;
			const response: any[] = await api.get_cache([queue_ident]);

			const data = find_state_data(queue_ident, response);

			for (let bd of data) {
				const build: Ibuilding = bd.data;

				// barracks
				if (Number(build.buildingType) == 19)
					if (Number(build.lvl) > 0) {
						location_id = build.locationId;
					}

				if (Number(build.buildingType) == 20)
					if (Number(build.lvl) > 0) {
						stable_id = build.locationId;
					}
			}

			params.push({villageId: village_id, villageName: village_name, locationId: location_id, stableId: stable_id});
			// params.push({villageId: village_id, villageName: village_name, locationId: location_id});
			log(params);
		}

		while (this.options.run) {
			for (let vo of params) {
				log("Build a unit in " + vo.villageName);
				if(vo.villageName == 'K01') {
					api.build_units(vo.villageId, vo.locationId, troops_type.swordsman, 1);
				} else {
					api.build_units(vo.villageId, vo.locationId, troops_type.phalanx, 1);
				}
				
				//api.build_units(vo.villageId, vo.stableId, troops_type.thunder, 1);
					// api.build_units(vo.villageId, vo.locationId, troops_type.phalanx, 1);	
			}
			await sleep(300);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`building units: ${this.options.uuid} stopped`, 'Units builder');
	}
}

export default new unit_builder();
