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
import com.obot.models.Tree;
import com.obot.repos.NodeRepo;
import com.obot.repos.TreeRepo;

@CrossOrigin(origins = "http://192.168.1.46:3000")
@RestController
@RequestMapping("/tree")
public class TreeController {

	@Autowired
	TreeRepo treeRepo;
	@Autowired
	NodeRepo nodeRepo;
	
	@GetMapping
	public List<Tree> getTrees(){
		return treeRepo.findAll();
	}
	
	@RequestMapping("/{name}")
	public Tree getTree(@PathVariable String name) {
		return treeRepo.getByName(name);
	}
	
	@PostMapping
	public void makeTree(@RequestBody Tree tree) {
		treeRepo.save(tree);
	}
	
	@RequestMapping("/{name}/{id}")
	public void setRoot(@PathVariable String name, @PathVariable String id) {
		Tree temp = getTree(name);
		temp.setRoot(nodeRepo.getById(id));
		makeTree(temp);
	}
	
	@DeleteMapping("/{name}")
	public void deleteTree(@PathVariable String name) {
		Node root = getTree(name).getRoot();
		if (root !=null)
			deleteNode(root.getId());
		treeRepo.delete(getTree(name));
	}
	

	public void deleteNode(String id) {
		Node node = nodeRepo.getById(id);
		List<Node> children = node.getChildren();
		if (!children.isEmpty()) 
			children.forEach(child -> deleteNode(child.getId()));
		nodeRepo.deleteById(id);
	}
	
}
