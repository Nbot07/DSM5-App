package com.obot.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obot.models.Tree;
import com.obot.repos.TreeRepo;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/tree")
public class TreeController {

	@Autowired
	TreeRepo treeRepo;
	
	@GetMapping
	public List<Tree> getTrees(){
		return treeRepo.findAll();
	}
	
	@PostMapping
	public void makeTree(@RequestBody Tree tree) {
		treeRepo.save(tree);
	}
	
	@DeleteMapping
	public void deleteTree(@RequestBody Tree tree) {
		treeRepo.delete(tree);
	}
	
}
