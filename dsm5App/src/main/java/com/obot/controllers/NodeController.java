package com.obot.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obot.models.Node;
import com.obot.repos.NodeRepo;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/node")
public class NodeController {
	
	@Autowired
	NodeRepo nodeRepo;
	
	@PostMapping
	public void makeNode(@RequestBody Node node) {
		nodeRepo.save(node);
	}
	
	@GetMapping
	public List<Node> getAllNodes(){
		return nodeRepo.findAll();
	}
}
