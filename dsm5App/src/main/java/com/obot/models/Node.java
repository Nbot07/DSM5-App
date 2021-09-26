package com.obot.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Node {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	int id;
	
	String name;
	String title;
	@OneToMany(cascade = {CascadeType.ALL})
	List<Node> children;
//	String description;
//	@OneToMany(mappedBy="parent")
//	List<Edge> answers;
	
//	@OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "edge_id", referencedColumnName = "id")
//	Edge parent;
}
