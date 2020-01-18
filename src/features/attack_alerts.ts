import { log, find_state_data, sleep, get_diff_time } from '../util';
import { village, player } from '../gamedata';
import { Ivillage, Ibuilding_queue, Iresources, Iplayer, Ibuilding_collection, Ibuilding } from '../interfaces';
import api from '../api';
import logger from '../logger';
import uniqid from 'uniqid';
import { Ifeature, feature_single, Ioptions, Iresponse } from './feature';
import { buildings, troops_type } from '../data';
import database from '../database';

import settings from '../settings'

const cred = settings.read_credentials();

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
	service: 'gmail',
 	auth: {
        user: 'chrisliu033@gmail.com',
        pass: cred.mail_pwd
    }
});

class attack_alerter extends feature_single {
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
			ident: 'attck_alerter',
			name: 'Attack Alerter'
		};
	}

	get_description(): string {
		return 'Send email when attacked';
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

	send_email(data:any): void {
		const message = {
			from: 'etherge@163.com', // Sender address
			to: 'etherge@gmail.com',         // List of recipients
			subject: 'Your village is under attack!', // Subject line
			text: data // Plain text body
		};
		
		transport.sendMail(message, function(err: any, info: any) {
			if (err) {
			  console.log(err)
			} else {
			  console.log(info);
			}
		});
	}

	async run(): Promise<void> {
		logger.info(`Attack alerter : ${this.options.uuid} started`, 'Attack alerter');

		const attack_ident: string = "Collection:TroopsMovementInfo:attackVillage";
		let params: string[] = ["Collection:TroopsMovementInfo:attackVillage:537477118",
			"Collection:TroopsMovementInfo:attackVillage:537509887",
			"Collection:TroopsMovementInfo:attackVillage:537444351"
		];

		while (this.options.run) {
			const response: any[] = await api.get_cache(params);
		
			log(response);

        	for(let at of response) {
				if(at.data != undefined && at.data.length > 0) {
					log(at.data);
					log("Got attacked and send email alert!");
					this.send_email(at.data.toString());
					await sleep(600);
				}
			}
			await sleep(300);
		}

		this.running = false;
		this.options.run = false;
		logger.info(`Attack alerter: ${this.options.uuid} stopped`, 'Attack alerter');
	}
}

export default new attack_alerter();
