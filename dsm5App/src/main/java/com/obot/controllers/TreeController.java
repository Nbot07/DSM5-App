package com.obot.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.obot.models.Tree;
import com.obot.repos.TreeRepo;

@RestController
public class TreeController {

	@Autowired
	TreeRepo treeRepo;
	
	@GetMapping("/hello")
	public String hello() {
		return "Hi";
	}
	
	@GetMapping("/trees")
	public List<Tree> getTrees(){
		return treeRepo.findAll();
	}
	
	@PostMapping("/tree")
	public void makeTree(@RequestBody Tree tree) {
		treeRepo.save(tree);
	}
	
	@DeleteMapping("/tree/{id}")
	public void deleteTree(@RequestParam String id) {
		treeRepo.deleteById(id);
	}
	
}
