package io.revlearners.model.bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table (name="TOPIC")
public class Topic implements Serializable{
	private static final long serialVersionUID = -7336698542678175301L;
	
	@Id
	@Column (name="TOPIC_ID")
	@SequenceGenerator(sequenceName="TOPIC_SEQ", name="TOPIC_SEQ")
	@GeneratedValue(generator="TOPIC_SEQ", strategy=GenerationType.SEQUENCE)
	private int topicId;
	
	@Column(name="TOPIC_NAME")
	private String topicName;

	public Topic(int topicId, String topicName) {
		super();
		this.topicId = topicId;
		this.topicName = topicName;
	}
	
	public Topic() {

	}

	public int getTopicId() {
		return topicId;
	}

	public void setTopicId(int topicId) {
		this.topicId = topicId;
	}

	public String getTopicName() {
		return topicName;
	}

	public void setTopicName(String topicName) {
		this.topicName = topicName;
	}

	@Override
	public String toString() {
		return "Topic [topicId=" + topicId + ", topicName=" + topicName + "]";
	}	

}
