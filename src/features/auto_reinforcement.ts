import { Ihero, Iplayer, Iunits } from '../interfaces';
import { feature_single, Ioptions, Ifeature, Iresponse } from './feature';
import { log, find_state_data, get_diff_time, sleep } from '../util';
import api from '../api';
import { player, village } from '../gamedata';
import database from '../database';
import uniqid from 'uniqid';

class auto_reinforcement extends feature_single {
	// idents for state data
	hero_ident: string = 'Hero:';

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
			ident: 'auto_inforcement',
			name: 'Auto Inforcement'
		};
	}

	get_long_description(): string {
		// key in the frontend language.js file
		return 'auto_inforcement';
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

	get_description(): string {
		return 'Auto reinforcement to K01';
	}

	update(options: Ioptions): Iresponse {
		return {
			error: false,
			data: null,
			message: ''
		};
	}

	async run(): Promise<void> {
		log(`Auto reinforcement : ${this.options.uuid} started`);
		const K02_village_id: number = 537509887;
		const K03_village_id: number = 537444351;
		// const K02_ident: string = "Collection:Troops:stationary:537509887";
		// const K03_ident: string = "Collection:Troops:stationary:537444351";
		while (this.options.run) {
			log("000000");
			this.auto_reinforcement(K02_village_id);
			log("3333333");
			this.auto_reinforcement(K03_village_id);
			await sleep(300);
		}
		this.running = false;
		this.options.run = false;
		log('auto reinforence stopped');
	}

	async auto_reinforcement(village_id: number): Promise<void> {
		const troop_collection_ident_pre: string = "Collection:Troops:stationary:";
		const response: any[] = await api.get_cache([troop_collection_ident_pre + village_id]);
		
		log("111111");

		for(let troop of response[0].data) {
			let units: Iunits = troop.data.units;
			this.sendTroopsToK01(village_id, units);
		}
	}

	async sendTroopsToK01(from_village: number, units: Iunits) {
		log("222222")
		api.send_units(from_village, 537477118, units, 5);
	}
}

export default new auto_reinforcement();
