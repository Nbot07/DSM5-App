package com.obot.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obot.models.Node;
import com.obot.repos.NodeRepo;

@CrossOrigin(origins = "http://192.168.1.46:3000")
@RestController
@RequestMapping("/node")
public class NodeController {
	
	@Autowired
	NodeRepo nodeRepo;
	
	@PostMapping
	public String saveNode(@RequestBody Node node) {
		return nodeRepo.save(node).getId();
	}
	
	@PostMapping("/{id}")
	public void appendChildNodes(@PathVariable String id, @RequestBody List<Node> nodes) {
		nodes.forEach(child -> saveNode(child));
		Node parentNode = getNode(id);
		parentNode.getChildren().addAll(nodes);
		saveNode(parentNode);
	}
	
	@GetMapping
	public List<Node> getAllNodes(){
		return nodeRepo.findAll();
	}
	
	@GetMapping("/{id}")
	public Node getNode(@PathVariable String id) {
		return nodeRepo.getById(id);
	}
	
	@DeleteMapping("/{ids}")
	public void deleteNodes(@PathVariable List<String> ids) {
		ids.forEach(id -> deleteNode(id));
	}

	public void deleteNode(String id) {
		Node node = getNode(id);
		List<Node> children = node.getChildren();
		if (!children.isEmpty()) 
			children.forEach(child -> deleteNode(child.getId()));
		nodeRepo.deleteById(id);
	}
}
