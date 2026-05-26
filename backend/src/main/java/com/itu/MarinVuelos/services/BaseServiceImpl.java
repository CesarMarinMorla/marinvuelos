package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.repositories.BaseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;


import java.io.Serializable;
import java.util.List;

public abstract class BaseServiceImpl<E extends Base, ID extends Serializable> implements BaseService<E, ID> {
    protected BaseRepository<E, ID> baseRepository;
    private static final Logger log = LoggerFactory.getLogger(BaseServiceImpl.class);

    public BaseServiceImpl(BaseRepository<E, ID> baseRepository) {
        this.baseRepository = baseRepository;
    }

    @Override
    @Transactional
    public List<E> findAll() throws Exception {
        return baseRepository.findAll();
    }

    @Override
    @Transactional
    public Page<E> findAll(Pageable pageable) throws Exception {
        try {
            return baseRepository.findAll(pageable);
        } catch (Exception e) {
            log.error("Error fetching paginated entities", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public E findById(ID id) throws Exception {
        try {
            return baseRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Entidad no encontrada: " + id));
        } catch (Exception e) {
            log.error("Error fetching entity id={}", id, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public E save(E entity) throws Exception {
        return baseRepository.save(entity);
    }

    @Override
    @Transactional
    public E update(ID id, E entity) throws Exception {
        try {
            if (!baseRepository.existsById(id)) {
                throw new EntityNotFoundException("Entidad no encontrada: " + id);
            }
            entity.setId((Long) id);
            return baseRepository.save(entity);
        } catch (Exception e) {
            log.error("Error updating entity id={}", id, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public boolean delete(ID id) throws Exception {
        try {
            if (!baseRepository.existsById(id)) {
                throw new EntityNotFoundException("Entidad no encontrada: " + id);
            }
            baseRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            log.error("Error deleting entity id={}", id, e);
            throw e;
        }
    }
}
