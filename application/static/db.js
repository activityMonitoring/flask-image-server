
var _request_pending = false;
function create_query(url, data, callback) {
	// console.log("create_query", url, data)
	if (_request_pending==true) 
		return Promise.reject("already waiting for a request to complete");
 	_request_pending = true;
	// url += "error time"
	return $.post(url, data)
		.done((response) => {
			console.log("POST success, data = ", response)
			if (callback) callback(undefined, {responseText:JSON.stringify(data)})
			return response;
		})
		.fail((err) => {
			console.log("POST error url = ", url, err)
			return err;
		})
		.always(() => {
			_request_pending = false;
		}) 
}
var Event = {
	// participant_id not really necessary here, but can't hurt
	check_valid: function(participant_id) {
		return create_query("/participant/"+participant_id+"/check_valid",undefined)
	},
	add_image: function(participant_id, event_id, image_id) {
		return create_query("/participant/"+participant_id+"/"+event_id+"/"+image_id+"/add_image",undefined)
	},
	remove_image: function(participant_id, event_id, image_id, direction, include_target) {
		return create_query(
			"/participant/"+participant_id+"/"+event_id+"/"+image_id+"/remove",
			{direction:direction, include_target:include_target})
	},
	split: function(dir, participant_id, event_id, image_id) {
		if (dir=="left" || dir=="right") 
			return create_query("/participant/"+participant_id+"/"+event_id+"/"+image_id+"/split_"+dir,undefined)
	},
	annotate_image: function(participant_id, image_id, label_id) {
		return create_query("/participant/"+participant_id+"/"+image_id+"/annotate_image",{label_id:label_id})
	},	
	annotate: function(participant_id, event_id, label_id) {
		return create_query("/participant/"+participant_id+"/"+event_id+"/annotate",{label_id:label_id})
	},
	annotate_and_set_color: function(participant_id, event_id, label_id, color) {
		return create_query("/participant/"+participant_id+"/"+event_id+"/annotate",{label_id:label_id, color:color})
	}
}
var Study = {
	remove_participant: function(participant_id, study_id) {
		return create_query("/remove_studyparticipant",{participant_id: participant_id, study_id:study_id})
	},
	remove_user: function(user_id, study_id) {
		return create_query("/user/"+user_id+"/modify_studies",{study_id:study_id, method: "remove"})
	},
	get_annotation_csv: function(participant_id, complte) {
		window.location = "/participant/"+participant_id+"/download_annotation"
	}
}
var User = {
	change_password: function(user_id, old_password, new_password) {
		return create_query("/user/"+user_id+"/change_password",{original_password: original_password, new_password:new_password})
	}
}
var Image = {
	load_by_id: function(participant_id, start, end, num) {
		return create_query("/participant/"+participant_id+"/load_images", {start_id:start, end_id:end, number:num})
	}
}
	// reload_by_id: function(participant_id, image_id_list) {
	// 	create_query("/participant/"+participant_id+"/load_images", {image_id_list:image_id_list})
	// }
var Datapoints = {
	get_datatypes: function(participant_id) {
		return $.post("/participant/"+participant_id+"/load_datatypes", null)
		// create_query("/participant/"+participant_id+"/load_images", {})
	},
	get_datapoints: function(participant_id, datatype_id) {
		return $.post("/participant/"+participant_id+"/load_datapoints/"+datatype_id, null)
		// create_query("/participant/"+participant_id+"/load_images", {})
	}
}