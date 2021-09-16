package com.obot.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Edge {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	int id;
	String answer;
	@ManyToOne
	@JoinColumn(name="node_id")
	Node parent;
	@ManyToOne
	@JoinColumn(name="node_id", insertable=false, updatable=false)
	Node child;
}
